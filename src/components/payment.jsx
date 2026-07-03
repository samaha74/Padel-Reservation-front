import React, { useState } from "react";
import "./payment.css";

function formatCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 4)
    .replace(/(.{2})/, "$1/");
}

export default function PaymentModal({ amount, courtName, date, time, onSuccess, onClose }) {
  const [step, setStep] = useState("form"); // "form" | "processing" | "success"
  const [method, setMethod] = useState("visa"); // "visa" | "cash"
  const [form, setForm] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === "cardNumber") formatted = formatCardNumber(value);
    if (name === "expiry") formatted = formatExpiry(value);
    if (name === "cvv") formatted = value.replace(/\D/g, "").slice(0, 3);
    setForm((prev) => ({ ...prev, [name]: formatted }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (method === "visa") {
      if (form.cardNumber.replace(/\s/g, "").length < 16)
        newErrors.cardNumber = "Enter a valid 16-digit card number";
      if (!form.cardName.trim())
        newErrors.cardName = "Enter the name on card";
      if (form.expiry.length < 5)
        newErrors.expiry = "Enter a valid expiry date";
      if (form.cvv.length < 3)
        newErrors.cvv = "Enter a valid CVV";
    }
    return newErrors;
  };

  const handlePay = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2000);
  };

  return (
    <div className="pm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pm-modal">

        {/* Header */}
        <div className="pm-header">
          <div className="pm-header__left">
            <span className="pm-header__icon">🔒</span>
            <span className="pm-header__title">Secure Payment</span>
          </div>
          <button className="pm-close" onClick={onClose}>✕</button>
        </div>

        {/* Order Summary */}
        <div className="pm-summary">
          <div className="pm-summary__row">
            <span>Court</span>
            <span>{courtName}</span>
          </div>
          <div className="pm-summary__row">
            <span>Date</span>
            <span>{date}</span>
          </div>
          <div className="pm-summary__row">
            <span>Time</span>
            <span>{time}</span>
          </div>
          <div className="pm-summary__row pm-summary__row--total">
            <span>Total</span>
            <span>{amount} EGP</span>
          </div>
        </div>

        {step === "form" && (
          <>
            {/* Payment Method Tabs */}
            <div className="pm-methods">
              <button
                className={`pm-method ${method === "visa" ? "pm-method--active" : ""}`}
                onClick={() => setMethod("visa")}
              >
                💳 Visa Card
              </button>
              <button
                className={`pm-method ${method === "cash" ? "pm-method--active" : ""}`}
                onClick={() => setMethod("cash")}
              >
                💵 Cash After Playing
              </button>
            </div>

            {/* Visa Form */}
            {method === "visa" && (
              <div className="pm-form">
                <div className="pm-card-icons">
                  <span className="pm-card-brand pm-card-brand--visa">VISA</span>
                  <span className="pm-card-brand pm-card-brand--mc">MC</span>
                  <span className="pm-card-brand pm-card-brand--meza">Meza</span>
                </div>

                <div className="pm-field">
                  <label>Card Number</label>
                  <input
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className={errors.cardNumber ? "pm-input pm-input--error" : "pm-input"}
                  />
                  {errors.cardNumber && <span className="pm-error">{errors.cardNumber}</span>}
                </div>

                <div className="pm-field">
                  <label>Name on Card</label>
                  <input
                    name="cardName"
                    value={form.cardName}
                    onChange={handleChange}
                    placeholder="Ahmed Mohamed"
                    className={errors.cardName ? "pm-input pm-input--error" : "pm-input"}
                  />
                  {errors.cardName && <span className="pm-error">{errors.cardName}</span>}
                </div>

                <div className="pm-row">
                  <div className="pm-field">
                    <label>Expiry Date</label>
                    <input
                      name="expiry"
                      value={form.expiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className={errors.expiry ? "pm-input pm-input--error" : "pm-input"}
                    />
                    {errors.expiry && <span className="pm-error">{errors.expiry}</span>}
                  </div>
                  <div className="pm-field">
                    <label>CVV</label>
                    <input
                      name="cvv"
                      value={form.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className={errors.cvv ? "pm-input pm-input--error" : "pm-input"}
                    />
                    {errors.cvv && <span className="pm-error">{errors.cvv}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Cash After Playing */}
            {method === "cash" && (
              <div className="pm-cash">
                <div className="pm-cash__icon">💵</div>
                <p className="pm-cash__title">Pay Cash After Playing</p>
                <p className="pm-cash__desc">
                  Your court is reserved. Simply show up and pay <strong>{amount} EGP</strong> in
                  cash to the court staff after your session ends.
                </p>
                <div className="pm-cash__note">
                  <span>⚠️</span>
                  <p>Please arrive on time. Your booking may be cancelled if you are more than 15 minutes late without notice.</p>
                </div>
              </div>
            )}

            <button className="pm-pay-btn" onClick={handlePay}>
              {method === "cash" ? `Confirm Booking — Pay ${amount} EGP Later` : `Pay ${amount} EGP`}
            </button>

            <p className="pm-secure-note">
              🔒 Your booking is encrypted and secure
            </p>
          </>
        )}

        {step === "processing" && (
          <div className="pm-processing">
            <div className="pm-spinner" />
            <p>{method === "cash" ? "Confirming your booking…" : "Processing your payment…"}</p>
          </div>
        )}

        {step === "success" && (
          <div className="pm-success">
            <div className="pm-success__icon">✅</div>
            <h3>{method === "cash" ? "Booking Confirmed!" : "Payment Successful!"}</h3>
            <p>
              {method === "cash"
                ? `Please pay ${amount} EGP in cash after your session. See you on the court!`
                : "Your court has been booked. See you on the court!"}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
