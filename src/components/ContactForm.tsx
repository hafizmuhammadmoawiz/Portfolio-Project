
import { useState, type FormEvent, type MouseEvent } from "react";
import emailjs from "@emailjs/browser";

import {
  Check,
  Copy,
  Loader2,
  Send,
  UserRound,
  Mail,
  MessageSquare,
  AtSign,
  AlertCircle,
} from "lucide-react";

import { site } from "../config/site";

const init = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

type FormValues = typeof init;
type FormErrors = Partial<Record<keyof FormValues, string>>;
type Status = "idle" | "loading" | "success" | "error";

const emailRegex =
  /^[^\s@<>(),;:"[\]\\]+@[^\s@<>(),;:"[\]\\]+\.[a-zA-Z]{2,63}$/;

const nameRegex =
  /^[\p{L}\p{M}]+(?:[ '\u2019.-][\p{L}\p{M}]+)*$/u;

const hasControlChars = (value: string) =>
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);

const hasUnsafeMarkup = (value: string) =>
  /<\s*\/?\s*[a-z!/?]|javascript\s*:|data\s*:\s*text\/html/i.test(value);

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (!name) {
    errors.name = "Please enter your full name.";
  } else if (name.length < 2 || name.length > 100) {
    errors.name = "Name must be between 2 and 100 characters.";
  } else if (!nameRegex.test(name)) {
    errors.name =
      "Use letters, spaces, hyphens, apostrophes or periods only.";
  }

  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (email.length > 254 || !emailRegex.test(email)) {
    errors.email = "Please enter a valid email address.";
  } else {
    const [localPart, domain] = email.split("@");
    const labels = domain.split(".");

    if (
      !localPart ||
      localPart.length > 64 ||
      domain.length > 253 ||
      labels.some(
        (label) =>
          !label ||
          label.length > 63 ||
          label.startsWith("-") ||
          label.endsWith("-")
      )
    ) {
      errors.email = "Please enter a valid email address.";
    }
  }

  if (!subject) {
    errors.subject = "Please add a subject.";
  } else if (subject.length < 3 || subject.length > 150) {
    errors.subject = "Subject must be between 3 and 150 characters.";
  } else if (
    hasControlChars(subject) ||
    /[<>]/.test(subject) ||
    hasUnsafeMarkup(subject)
  ) {
    errors.subject = "HTML, code and invalid characters are not allowed.";
  }

  if (!message) {
    errors.message = "Please enter a message.";
  } else if (message.length < 10 || message.length > 3000) {
    errors.message = "Message must be between 10 and 3000 characters.";
  } else if (
    hasControlChars(message) ||
    hasUnsafeMarkup(message)
  ) {
    errors.message = "HTML or executable markup is not allowed.";
  }

  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(init);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormValues, boolean>>
  >({});
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  const updateField = (key: keyof FormValues, value: string) => {
    const updated = { ...values, [key]: value };

    setValues(updated);

    if (touched[key]) {
      setErrors(validate(updated));
    }

    if (status !== "idle") {
      setStatus("idle");
    }
  };

  const blurField = (key: keyof FormValues) => {
    setTouched((previous) => ({ ...previous, [key]: true }));
    setErrors(validate(values));
  };

  const handleTilt = (event: MouseEvent<HTMLFormElement>) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none)").matches
    ) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    event.currentTarget.style.setProperty(
      "--form-tilt-x",
      `${(0.5 - y) * 5}deg`
    );

    event.currentTarget.style.setProperty(
      "--form-tilt-y",
      `${(x - 0.5) * 5}deg`
    );
  };

  const resetTilt = (event: MouseEvent<HTMLFormElement>) => {
    event.currentTarget.style.setProperty("--form-tilt-x", "0deg");
    event.currentTarget.style.setProperty("--form-tilt-y", "0deg");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "loading") return;

    const validationErrors = validate(values);

    setErrors(validationErrors);
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      const firstInvalid = event.currentTarget.querySelector(
        '[aria-invalid="true"]'
      ) as HTMLElement | null;

      firstInvalid?.focus();
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error(
        "EmailJS configuration is missing. Check your .env.local file."
      );
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
          time: new Date().toLocaleString(),
          title: values.subject.trim(),
        },
        { publicKey }
      );

      setStatus("success");
      setValues(init);
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error("EmailJS send failed:", error);
      setStatus("error");
    }
  };

  const copyMessage = async () => {
    const text =
      `To: ${site.email}\n` +
      `Subject: ${values.subject.trim()}\n\n` +
      `${values.message.trim()}\n\n` +
      `From: ${values.name.trim()}\n` +
      `Reply to: ${values.email.trim()}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const field = (
    key: keyof FormValues,
    label: string,
    options: {
      type?: string;
      autoComplete?: string;
      placeholder: string;
      icon: typeof UserRound;
    },
    area = false
  ) => {
    const id = `cf-${key}`;
    const error = touched[key] ? errors[key] : undefined;
    const Icon = options.icon;

    const maxLength =
      key === "name" ? 100 :
      key === "email" ? 254 :
      key === "subject" ? 150 : 3000;

    const shared = {
      id,
      name: key,
      value: values[key],
      required: true,
      "aria-invalid": Boolean(error),
      "aria-describedby": error ? `${id}-error` : undefined,
      onBlur: () => blurField(key),
      placeholder: options.placeholder,
      maxLength,
      className: `contact-input input w-full ${
        error ? "contact-input-error" : ""
      }`,
    };

    return (
      <div className="min-w-0">
        <label
          htmlFor={id}
          className="mb-2 flex items-center gap-2 text-sm font-semibold"
        >
          <Icon size={15} className="text-accent" aria-hidden="true" />
          {label}
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        </label>

        {area ? (
          <textarea
            {...shared}
            rows={5}
            onChange={(event) => updateField(key, event.target.value)}
            className={`${shared.className} min-h-36 resize-y`}
          />
        ) : (
          <input
            {...shared}
            type={options.type ?? "text"}
            autoComplete={options.autoComplete}
            onChange={(event) => updateField(key, event.target.value)}
          />
        )}

        <div className="mt-1.5 flex items-start justify-between gap-3">
          {error ? (
            <p
              id={`${id}-error`}
              role="alert"
              className="text-sm text-[#e5484d]"
            >
              {error}
            </p>
          ) : (
            <span className="text-xs text-muted">
              {key === "message" ? "Minimum 10 characters" : "\u00A0"}
            </span>
          )}

          {key === "message" && (
            <span className="shrink-0 text-xs text-muted">
              {values.message.length}/3000
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      id="contact-form"
      className="contact-form-outer rounded-[1.6rem] p-2 sm:p-3"
    >
      <form
        onSubmit={submit}
        onMouseMove={handleTilt}
        onMouseLeave={resetTilt}
        noValidate
        className="contact-form-inner card space-y-6 rounded-[1.25rem] p-5 sm:p-8 lg:p-10"
        aria-label="Contact form"
      >
        <div className="mb-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Contact form
          </p>

          <h3 className="text-xl font-bold sm:text-2xl">
            Send me a message
          </h3>

          <p className="mt-2 text-sm leading-6 text-muted">
            Have a project, opportunity, or question? Fill in the details below
            and get in touch.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {field("name", "Full Name", {
            placeholder: "Your full name",
            autoComplete: "name",
            icon: UserRound,
          })}

          {field("email", "Email Address", {
            type: "email",
            placeholder: "you@example.com",
            autoComplete: "email",
            icon: AtSign,
          })}
        </div>

        {field("subject", "Email Subject", {
          placeholder: "What would you like to discuss?",
          icon: Mail,
        })}

        {field(
          "message",
          "Message",
          {
            placeholder:
              "Tell me a little about your idea, project, or question...",
            icon: MessageSquare,
          },
          true
        )}

        <div className="flex flex-col items-start gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xs text-xs leading-5 text-muted">
            Your message will be sent directly to my inbox.
          </p>

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn btn-primary group w-full sm:w-auto"
          >
            {status === "loading" ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                  aria-hidden="true"
                />
                Sending...
              </>
            ) : status === "success" ? (
              <>
                <Check size={18} aria-hidden="true" />
                Message Sent
              </>
            ) : (
              <>
                <Send
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
                Send Message
              </>
            )}
          </button>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {status === "success" && (
            <div className="rounded-xl border border-[var(--accent-line)] bg-[var(--chip-bg)] p-4 text-sm">
              <div className="flex items-start gap-3">
                <Check
                  size={20}
                  className="mt-0.5 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="font-semibold">
                    Your message was sent successfully!
                  </p>
                  <p className="mt-1 leading-6 text-muted">
                    Thank you for contacting me. I&apos;ll get back to you as
                    soon as possible.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div
              className="rounded-xl border border-[#e5484d]/40 bg-[var(--chip-bg)] p-4 text-sm"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0 text-[#e5484d]"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="font-semibold">
                    We couldn&apos;t send your message.
                  </p>
                  <p className="mt-1 leading-6 text-muted">
                    Please check your connection and try again. If the problem
                    continues, copy your message and email {site.email} directly.
                  </p>

                  <button
                    type="button"
                    onClick={copyMessage}
                    className="btn btn-ghost !mt-3 !min-h-10 !py-2 text-sm"
                  >
                    {copied ? (
                      <Check size={16} aria-hidden="true" />
                    ) : (
                      <Copy size={16} aria-hidden="true" />
                    )}
                    {copied ? "Copied!" : "Copy message"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
