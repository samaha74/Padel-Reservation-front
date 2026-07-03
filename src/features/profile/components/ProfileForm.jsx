import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Spinner, Alert } from "react-bootstrap";

const profileSchema = Yup.object({
  name: Yup.string().min(2, "Name too short").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "At least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your password"),
});

const fieldStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #DDD9D2",
  borderRadius: 10,
  fontFamily: "DM Sans, sans-serif",
  fontSize: 14,
  color: "#0F0F0F",
  background: "#fff",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: "#5A5752",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 6,
  display: "block",
};

function FieldGroup({ label, name, type = "text", placeholder }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        style={fieldStyle}
        onFocus={(e) => {
          e.target.style.borderColor = "#E07B00";
          e.target.style.boxShadow = "0 0 0 3px rgba(224,123,0,0.12)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#DDD9D2";
          e.target.style.boxShadow = "none";
        }}
      />
      <ErrorMessage
        name={name}
        render={(msg) => (
          <p style={{ fontSize: 12, color: "#8C1F1F", marginTop: 4 }}>{msg}</p>
        )}
      />
    </div>
  );
}

export function EditProfileForm({ profile, onSave, saving }) {
  return (
    <Formik
      enableReinitialize
      initialValues={{ name: profile?.name || "", email: profile?.email || "" }}
      validationSchema={profileSchema}
      onSubmit={async (values, { setStatus }) => {
        const result = await onSave(values);
        if (!result.success) setStatus({ error: result.message });
        else setStatus({ success: "Profile updated successfully!" });
      }}
    >
      {({ status }) => (
        <Form>
          {status?.error && (
            <Alert variant="danger" style={{ fontSize: 13 }}>
              {status.error}
            </Alert>
          )}
          {status?.success && (
            <Alert variant="success" style={{ fontSize: 13 }}>
              {status.success}
            </Alert>
          )}
          <div className="row g-3">
            <div className="col-12">
              <FieldGroup label="Full Name" name="name" placeholder="Your full name" />
            </div>
            <div className="col-12">
              <FieldGroup label="Email Address" name="email" type="email" placeholder="your@email.com" />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button
              type="submit"
              disabled={saving}
              style={{
                background: "#E07B00",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 28px",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {saving && <Spinner animation="border" size="sm" />}
              Save Changes
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export function ChangePasswordForm({ onChangePassword, saving }) {
  return (
    <Formik
      initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
      validationSchema={passwordSchema}
      onSubmit={async (values, { setStatus, resetForm }) => {
        const result = await onChangePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        if (!result.success) setStatus({ error: result.message });
        else {
          setStatus({ success: "Password changed successfully!" });
          resetForm();
        }
      }}
    >
      {({ status }) => (
        <Form>
          {status?.error && (
            <Alert variant="danger" style={{ fontSize: 13 }}>
              {status.error}
            </Alert>
          )}
          {status?.success && (
            <Alert variant="success" style={{ fontSize: 13 }}>
              {status.success}
            </Alert>
          )}
          <FieldGroup label="Current Password" name="currentPassword" type="password" placeholder="••••••••" />
          <FieldGroup label="New Password" name="newPassword" type="password" placeholder="At least 6 characters" />
          <FieldGroup label="Confirm New Password" name="confirmPassword" type="password" placeholder="Repeat new password" />
          <div className="d-flex justify-content-end mt-3">
            <button
              type="submit"
              disabled={saving}
              style={{
                background: "#0F0F0F",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 28px",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {saving && <Spinner animation="border" size="sm" />}
              Update Password
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}