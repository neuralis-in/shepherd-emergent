# Razorpay Backend Setup Guide (FastAPI)

This guide explains how to set up the backend server for the Shepherd Enterprise payment system using FastAPI and Razorpay.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Setup](#environment-setup)
4. [Razorpay Dashboard Setup](#razorpay-dashboard-setup)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Webhook Setup](#webhook-setup)
8. [Testing](#testing)
9. [Production Checklist](#production-checklist)

---

## Prerequisites

- Python 3.9+
- FastAPI application
- Razorpay account (https://razorpay.com)
- PostgreSQL/MySQL database

---

## Installation

```bash
pip install razorpay fastapi pydantic python-dotenv
```

---

## Environment Setup

Create a `.env` file in your backend root:

```env
# Razorpay Credentials
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here

# Webhook Secret (get from Razorpay Dashboard)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Database
DATABASE_URL=postgresql://user:password@localhost/shepherd
```

---

## Razorpay Dashboard Setup

### 1. Create Subscription Plans

Go to **Razorpay Dashboard → Subscriptions → Plans → Create Plan**

Create plans for each pricing tier:

| Plan Name | Plan ID (note this) | Amount (paise) | Period | Interval |
|-----------|---------------------|----------------|--------|----------|
| Enterprise Custom | `plan_xxxxx` | Variable | monthly | 1 |

> **Note:** For custom pricing per client, you'll create plans dynamically via API.

### 2. Enable Subscriptions

Go to **Settings → Subscriptions** and enable the subscription feature.

### 3. Set up Webhooks

Go to **Settings → Webhooks → Add New Webhook**

- **Webhook URL:** `https://your-api.com/v1/webhooks/razorpay`
- **Secret:** Generate and save this
- **Events to subscribe:**
  - `subscription.activated`
  - `subscription.charged`
  - `subscription.completed`
  - `subscription.updated`
  - `subscription.pending`
  - `subscription.halted`
  - `subscription.cancelled`
  - `payment.authorized`
  - `payment.captured`
  - `payment.failed`

---

## Database Schema

### SQLAlchemy Models

```python
# models/subscription.py

from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .base import Base

class SubscriptionStatus(enum.Enum):
    CREATED = "created"
    AUTHENTICATED = "authenticated"
    ACTIVE = "active"
    PENDING = "pending"
    HALTED = "halted"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
    EXPIRED = "expired"

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String(50), primary_key=True)  # Razorpay subscription_id
    client_id = Column(String(100), nullable=False, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    
    # Razorpay IDs
    razorpay_subscription_id = Column(String(50), unique=True, nullable=False)
    razorpay_plan_id = Column(String(50), nullable=False)
    razorpay_customer_id = Column(String(50), nullable=True)
    
    # Subscription details
    amount = Column(Integer, nullable=False)  # Amount in paise
    currency = Column(String(3), default="INR")
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.CREATED)
    
    # Billing details
    billing_name = Column(String(255), nullable=False)
    billing_email = Column(String(255), nullable=False)
    billing_phone = Column(String(20), nullable=False)
    billing_company = Column(String(255), nullable=True)
    
    # Dates
    current_start = Column(DateTime, nullable=True)
    current_end = Column(DateTime, nullable=True)
    charge_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    cancelled_at = Column(DateTime, nullable=True)

    # Relationships
    payments = relationship("Payment", back_populates="subscription")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(50), primary_key=True)  # Razorpay payment_id
    subscription_id = Column(String(50), ForeignKey("subscriptions.id"), nullable=False)
    
    razorpay_payment_id = Column(String(50), unique=True, nullable=False)
    razorpay_order_id = Column(String(50), nullable=True)
    razorpay_signature = Column(String(255), nullable=True)
    
    amount = Column(Integer, nullable=False)  # Amount in paise
    currency = Column(String(3), default="INR")
    status = Column(String(20), nullable=False)  # captured, failed, etc.
    method = Column(String(50), nullable=True)  # card, upi, netbanking, etc.
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    subscription = relationship("Subscription", back_populates="payments")
```

---

## API Endpoints

### Complete FastAPI Implementation

```python
# routers/subscriptions.py

import razorpay
import hmac
import hashlib
from fastapi import APIRouter, HTTPException, Depends, Request, Header
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import os
import uuid

from ..database import get_db
from ..models.subscription import Subscription, Payment, SubscriptionStatus

router = APIRouter(prefix="/v1", tags=["subscriptions"])

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET"))
)

# ========================================
# Pydantic Models
# ========================================

class BillingDetails(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = None

class CreateSubscriptionRequest(BaseModel):
    client_id: str
    amount: int  # Amount in INR (will be converted to paise)
    plan_id: Optional[str] = None
    billing_details: BillingDetails

class VerifySubscriptionRequest(BaseModel):
    razorpay_payment_id: str
    razorpay_subscription_id: str
    razorpay_signature: str

class SubscriptionResponse(BaseModel):
    subscription_id: str
    status: str
    short_url: Optional[str] = None

# ========================================
# Helper Functions
# ========================================

def create_razorpay_plan(amount_inr: int, client_id: str) -> str:
    """Create a custom plan for the client"""
    plan = razorpay_client.plan.create({
        "period": "monthly",
        "interval": 1,
        "item": {
            "name": f"Shepherd Enterprise - {client_id}",
            "amount": amount_inr * 100,  # Convert to paise
            "currency": "INR",
            "description": f"Enterprise subscription for {client_id}"
        }
    })
    return plan["id"]

def verify_razorpay_signature(
    razorpay_payment_id: str,
    razorpay_subscription_id: str,
    razorpay_signature: str
) -> bool:
    """Verify Razorpay payment signature"""
    try:
        razorpay_client.utility.verify_subscription_payment_signature({
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_subscription_id": razorpay_subscription_id,
            "razorpay_signature": razorpay_signature
        })
        return True
    except razorpay.errors.SignatureVerificationError:
        return False

# ========================================
# Endpoints
# ========================================

@router.post("/subscriptions/create", response_model=SubscriptionResponse)
async def create_subscription(
    request: CreateSubscriptionRequest,
    db = Depends(get_db)
):
    """
    Create a new subscription for enterprise client.
    
    Flow:
    1. Create a custom plan with the specified amount
    2. Create a subscription with that plan
    3. Return subscription_id for Razorpay checkout
    """
    try:
        # Step 1: Create a custom plan for this pricing
        plan_id = request.plan_id
        if not plan_id:
            plan_id = create_razorpay_plan(request.amount, request.client_id)
        
        # Step 2: Create Razorpay customer (optional but recommended)
        customer = razorpay_client.customer.create({
            "name": request.billing_details.name,
            "email": request.billing_details.email,
            "contact": request.billing_details.phone,
            "notes": {
                "client_id": request.client_id,
                "company": request.billing_details.company or ""
            }
        })
        
        # Step 3: Create subscription
        subscription_data = {
            "plan_id": plan_id,
            "customer_notify": 1,
            "total_count": 120,  # Max 10 years of monthly billing
            "customer_id": customer["id"],
            "notes": {
                "client_id": request.client_id,
                "company": request.billing_details.company or ""
            }
        }
        
        subscription = razorpay_client.subscription.create(subscription_data)
        
        # Step 4: Save to database
        db_subscription = Subscription(
            id=str(uuid.uuid4()),
            client_id=request.client_id,
            razorpay_subscription_id=subscription["id"],
            razorpay_plan_id=plan_id,
            razorpay_customer_id=customer["id"],
            amount=request.amount * 100,  # Store in paise
            status=SubscriptionStatus.CREATED,
            billing_name=request.billing_details.name,
            billing_email=request.billing_details.email,
            billing_phone=request.billing_details.phone,
            billing_company=request.billing_details.company
        )
        db.add(db_subscription)
        db.commit()
        
        return SubscriptionResponse(
            subscription_id=subscription["id"],
            status=subscription["status"],
            short_url=subscription.get("short_url")
        )
        
    except razorpay.errors.BadRequestError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create subscription: {str(e)}")


@router.post("/subscriptions/verify")
async def verify_subscription(
    request: VerifySubscriptionRequest,
    db = Depends(get_db)
):
    """
    Verify subscription payment after Razorpay checkout.
    Called from frontend after successful payment.
    """
    # Verify signature
    if not verify_razorpay_signature(
        request.razorpay_payment_id,
        request.razorpay_subscription_id,
        request.razorpay_signature
    ):
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    
    # Update subscription status
    subscription = db.query(Subscription).filter(
        Subscription.razorpay_subscription_id == request.razorpay_subscription_id
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    # Fetch latest subscription details from Razorpay
    rz_subscription = razorpay_client.subscription.fetch(request.razorpay_subscription_id)
    
    subscription.status = SubscriptionStatus.ACTIVE
    subscription.current_start = datetime.fromtimestamp(rz_subscription.get("current_start", 0))
    subscription.current_end = datetime.fromtimestamp(rz_subscription.get("current_end", 0))
    subscription.charge_at = datetime.fromtimestamp(rz_subscription.get("charge_at", 0))
    
    # Record the payment
    payment = Payment(
        id=str(uuid.uuid4()),
        subscription_id=subscription.id,
        razorpay_payment_id=request.razorpay_payment_id,
        razorpay_signature=request.razorpay_signature,
        amount=subscription.amount,
        status="captured"
    )
    db.add(payment)
    db.commit()
    
    return {
        "status": "verified",
        "subscription_id": subscription.id,
        "client_id": subscription.client_id,
        "valid_until": subscription.current_end.isoformat() if subscription.current_end else None
    }


@router.get("/subscriptions/current")
async def get_current_subscription(
    client_id: str,
    db = Depends(get_db)
):
    """Get active subscription for a client"""
    subscription = db.query(Subscription).filter(
        Subscription.client_id == client_id,
        Subscription.status == SubscriptionStatus.ACTIVE
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="No active subscription found")
    
    return {
        "id": subscription.id,
        "client_id": subscription.client_id,
        "status": subscription.status.value,
        "amount": subscription.amount / 100,  # Convert paise to INR
        "currency": subscription.currency,
        "current_period_start": subscription.current_start.isoformat() if subscription.current_start else None,
        "current_period_end": subscription.current_end.isoformat() if subscription.current_end else None,
        "next_charge_at": subscription.charge_at.isoformat() if subscription.charge_at else None,
        "billing": {
            "name": subscription.billing_name,
            "email": subscription.billing_email,
            "company": subscription.billing_company
        }
    }


@router.post("/subscriptions/current/cancel")
async def cancel_subscription(
    client_id: str,
    cancel_at_cycle_end: bool = True,
    db = Depends(get_db)
):
    """
    Cancel a subscription.
    
    Args:
        client_id: The client ID
        cancel_at_cycle_end: If True, subscription remains active until current period ends.
                            If False, cancels immediately.
    """
    subscription = db.query(Subscription).filter(
        Subscription.client_id == client_id,
        Subscription.status == SubscriptionStatus.ACTIVE
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="No active subscription found")
    
    try:
        if cancel_at_cycle_end:
            # Cancel at end of current billing cycle
            razorpay_client.subscription.cancel(
                subscription.razorpay_subscription_id,
                {"cancel_at_cycle_end": 1}
            )
            subscription.status = SubscriptionStatus.PENDING  # Will be cancelled at cycle end
        else:
            # Cancel immediately
            razorpay_client.subscription.cancel(subscription.razorpay_subscription_id)
            subscription.status = SubscriptionStatus.CANCELLED
            subscription.cancelled_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "status": "cancelled" if not cancel_at_cycle_end else "pending_cancellation",
            "effective_date": subscription.current_end.isoformat() if cancel_at_cycle_end and subscription.current_end else datetime.utcnow().isoformat()
        }
        
    except razorpay.errors.BadRequestError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/billing/history")
async def get_billing_history(
    client_id: str,
    limit: int = 10,
    db = Depends(get_db)
):
    """Get payment history for a client"""
    subscription = db.query(Subscription).filter(
        Subscription.client_id == client_id
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="No subscription found")
    
    payments = db.query(Payment).filter(
        Payment.subscription_id == subscription.id
    ).order_by(Payment.created_at.desc()).limit(limit).all()
    
    return {
        "client_id": client_id,
        "payments": [
            {
                "id": p.razorpay_payment_id,
                "amount": p.amount / 100,
                "currency": p.currency,
                "status": p.status,
                "method": p.method,
                "date": p.created_at.isoformat()
            }
            for p in payments
        ]
    }
```

---

## Webhook Setup

### Webhook Handler

```python
# routers/webhooks.py

import hmac
import hashlib
import json
from fastapi import APIRouter, Request, HTTPException, Header
from datetime import datetime
import os

from ..database import get_db
from ..models.subscription import Subscription, Payment, SubscriptionStatus

router = APIRouter(prefix="/v1/webhooks", tags=["webhooks"])

def verify_webhook_signature(body: bytes, signature: str) -> bool:
    """Verify Razorpay webhook signature"""
    secret = os.getenv("RAZORPAY_WEBHOOK_SECRET")
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        body,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected_signature, signature)


@router.post("/razorpay")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(None)
):
    """
    Handle Razorpay webhook events.
    
    Events handled:
    - subscription.activated
    - subscription.charged
    - subscription.cancelled
    - subscription.halted
    - payment.captured
    - payment.failed
    """
    body = await request.body()
    
    # Verify signature
    if not x_razorpay_signature or not verify_webhook_signature(body, x_razorpay_signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")
    
    payload = json.loads(body)
    event = payload.get("event")
    
    db = next(get_db())
    
    try:
        if event == "subscription.activated":
            await handle_subscription_activated(payload, db)
        
        elif event == "subscription.charged":
            await handle_subscription_charged(payload, db)
        
        elif event == "subscription.cancelled":
            await handle_subscription_cancelled(payload, db)
        
        elif event == "subscription.halted":
            await handle_subscription_halted(payload, db)
        
        elif event == "payment.captured":
            await handle_payment_captured(payload, db)
        
        elif event == "payment.failed":
            await handle_payment_failed(payload, db)
        
        db.commit()
        return {"status": "ok"}
        
    except Exception as e:
        db.rollback()
        print(f"Webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


async def handle_subscription_activated(payload: dict, db):
    """Handle subscription.activated event"""
    data = payload["payload"]["subscription"]["entity"]
    subscription_id = data["id"]
    
    subscription = db.query(Subscription).filter(
        Subscription.razorpay_subscription_id == subscription_id
    ).first()
    
    if subscription:
        subscription.status = SubscriptionStatus.ACTIVE
        subscription.current_start = datetime.fromtimestamp(data.get("current_start", 0))
        subscription.current_end = datetime.fromtimestamp(data.get("current_end", 0))
        subscription.charge_at = datetime.fromtimestamp(data.get("charge_at", 0))


async def handle_subscription_charged(payload: dict, db):
    """Handle subscription.charged event - recurring payment success"""
    data = payload["payload"]["subscription"]["entity"]
    payment_data = payload["payload"]["payment"]["entity"]
    subscription_id = data["id"]
    
    subscription = db.query(Subscription).filter(
        Subscription.razorpay_subscription_id == subscription_id
    ).first()
    
    if subscription:
        # Update subscription dates
        subscription.current_start = datetime.fromtimestamp(data.get("current_start", 0))
        subscription.current_end = datetime.fromtimestamp(data.get("current_end", 0))
        subscription.charge_at = datetime.fromtimestamp(data.get("charge_at", 0))
        
        # Record payment
        payment = Payment(
            id=str(uuid.uuid4()),
            subscription_id=subscription.id,
            razorpay_payment_id=payment_data["id"],
            amount=payment_data["amount"],
            status="captured",
            method=payment_data.get("method")
        )
        db.add(payment)
        
        # TODO: Send payment receipt email


async def handle_subscription_cancelled(payload: dict, db):
    """Handle subscription.cancelled event"""
    data = payload["payload"]["subscription"]["entity"]
    subscription_id = data["id"]
    
    subscription = db.query(Subscription).filter(
        Subscription.razorpay_subscription_id == subscription_id
    ).first()
    
    if subscription:
        subscription.status = SubscriptionStatus.CANCELLED
        subscription.cancelled_at = datetime.utcnow()
        
        # TODO: Send cancellation email
        # TODO: Revoke access (or schedule revocation)


async def handle_subscription_halted(payload: dict, db):
    """Handle subscription.halted event - payment failed multiple times"""
    data = payload["payload"]["subscription"]["entity"]
    subscription_id = data["id"]
    
    subscription = db.query(Subscription).filter(
        Subscription.razorpay_subscription_id == subscription_id
    ).first()
    
    if subscription:
        subscription.status = SubscriptionStatus.HALTED
        
        # TODO: Send payment failed notification
        # TODO: Implement grace period logic


async def handle_payment_captured(payload: dict, db):
    """Handle payment.captured event"""
    data = payload["payload"]["payment"]["entity"]
    # Additional payment processing if needed
    pass


async def handle_payment_failed(payload: dict, db):
    """Handle payment.failed event"""
    data = payload["payload"]["payment"]["entity"]
    
    # Record failed payment attempt
    payment = Payment(
        id=str(uuid.uuid4()),
        subscription_id=None,  # May not have subscription context
        razorpay_payment_id=data["id"],
        amount=data["amount"],
        status="failed",
        method=data.get("method")
    )
    db.add(payment)
    
    # TODO: Send payment failed notification
```

---

## Testing

### Test Cards (Razorpay Test Mode)

| Card Number | Expiry | CVV | Result |
|-------------|--------|-----|--------|
| 4111 1111 1111 1111 | Any future date | Any 3 digits | Success |
| 5267 3181 8797 5449 | Any future date | Any 3 digits | Success (Mastercard) |
| 4000 0000 0000 0002 | Any future date | Any 3 digits | Declined |

### Test UPI

| VPA | Result |
|-----|--------|
| success@razorpay | Success |
| failure@razorpay | Failure |

### Test Net Banking

Use any test credentials in test mode.

### Generate Test Payment Link

```python
# utils/generate_link.py

import base64

def generate_payment_link(client_id: str, amount_inr: int, base_url: str = "https://yoursite.com/shepherd"):
    """Generate a payment link for enterprise client"""
    encoded_price = base64.b64encode(str(amount_inr).encode()).decode()
    return f"{base_url}/enterprise?client_id={client_id}&price={encoded_price}"

# Example usage
link = generate_payment_link("acme-corp", 49999)
print(link)
# Output: https://yoursite.com/shepherd/enterprise?client_id=acme-corp&price=NDk5OTk=
```

---

## Production Checklist

### Before Going Live

- [ ] Switch from test to live Razorpay keys
- [ ] Update `VITE_RAZORPAY_KEY_ID` in frontend `.env`
- [ ] Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in backend `.env`
- [ ] Set up live webhook URL in Razorpay Dashboard
- [ ] Update `RAZORPAY_WEBHOOK_SECRET` with live secret
- [ ] Complete KYC verification on Razorpay
- [ ] Test end-to-end flow with a real card (small amount)
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Set up email notifications for:
  - Subscription activated
  - Payment received
  - Payment failed
  - Subscription cancelled
- [ ] Implement proper logging
- [ ] Set up database backups

### Security Considerations

1. **Never expose `RAZORPAY_KEY_SECRET`** - Keep it server-side only
2. **Always verify webhook signatures** - Prevent spoofed events
3. **Validate payment amounts** - Ensure client can't manipulate price
4. **Use HTTPS** - Razorpay requires HTTPS for webhooks
5. **Implement rate limiting** - Prevent abuse
6. **Log all transactions** - For audit trail

---

## Quick Reference

### Frontend Environment Variable
```env
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

### Backend Environment Variables
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/subscriptions/create` | Create new subscription |
| POST | `/v1/subscriptions/verify` | Verify payment after checkout |
| GET | `/v1/subscriptions/current?client_id=xxx` | Get active subscription |
| POST | `/v1/subscriptions/current/cancel?client_id=xxx` | Cancel subscription |
| GET | `/v1/billing/history?client_id=xxx` | Get payment history |
| POST | `/v1/webhooks/razorpay` | Razorpay webhook handler |

---

## Support

- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Subscriptions: https://razorpay.com/docs/subscriptions/
- Razorpay API Reference: https://razorpay.com/docs/api/

