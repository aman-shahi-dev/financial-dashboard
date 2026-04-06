import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppSelector";
import { closeModal } from "../../store/uiSlice";
import { addTransaction, editTransaction } from "../../store/transactionsSlice";
import { CATEGORIES } from "../../utils/mockData";

const uid = () => Math.random().toString(36).slice(2, 10);

const FIELDS = [
  { label: "Description", key: "description", type: "text" },
  { label: "Amount", key: "amount", type: "number", min: 0 },
  { label: "Date", key: "date", type: "date" },
  {
    label: "Type",
    key: "type",
    type: "select",
    options: ["income", "expense"],
  },
  { label: "Category", key: "category", type: "select", options: CATEGORIES },
];

const EMPTY = {
  description: "",
  amount: "",
  date: "",
  type: "expense",
  category: "Housing",
};

export default function Modal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.isModalOpen);
  const editing = useAppSelector((s) => s.ui.editingTransaction);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editing) {
      setForm({ ...editing, amount: String(editing.amount) });
    } else {
      setForm({ ...EMPTY, date: new Date().toISOString().slice(0, 10) });
    }
    setErrors({});
  }, [editing, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Required";
    if (!form.amount || Number(form.amount) <= 0) e.amount = "Must be > 0";
    if (!form.date) e.date = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      ...form,
      amount: Number(form.amount),
      id: editing?.id ?? uid(),
    };
    editing
      ? dispatch(editTransaction(payload))
      : dispatch(addTransaction(payload));
    dispatch(closeModal());
  };

  const inputStyle = (key) => ({
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: `0.5px solid ${errors[key] ? "var(--color-expense)" : "var(--color-border)"}`,
    background: "var(--color-surface-2)",
    color: "var(--color-text-primary)",
    fontSize: "14px",
    outline: "none",
    fontFamily: "Inter, sans-serif",
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeModal())}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 200,
            }}
          />

          {/* Modal wrapper — handles centering + scroll */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 201,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 16px",
              overflowY: "auto",
              pointerEvents: "none",
            }}
          >
            {/* Modal card */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                background: "var(--color-surface)",
                border: "0.5px solid var(--color-border)",
                borderRadius: "16px",
                padding: "28px",
                width: "100%",
                maxWidth: "440px",
                pointerEvents: "all",
                boxSizing: "border-box",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {editing ? "Edit transaction" : "Add transaction"}
                  </h2>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--color-text-secondary)",
                      marginTop: "2px",
                    }}
                  >
                    {editing
                      ? "Update the details below"
                      : "Fill in the details below"}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(closeModal())}
                  style={{
                    background: "none",
                    border: "0.5px solid var(--color-border)",
                    borderRadius: "8px",
                    padding: "6px",
                    cursor: "pointer",
                    color: "var(--color-text-secondary)",
                    display: "flex",
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Fields */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {FIELDS.map(({ label, key, type, options, min }) => (
                  <div key={key}>
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "var(--color-text-secondary)",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      {label}
                    </label>
                    {type === "select" ? (
                      <select
                        value={form[key]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                        style={inputStyle(key)}
                      >
                        {options.map((o) => (
                          <option key={o} value={o}>
                            {o.charAt(0).toUpperCase() + o.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        min={min}
                        value={form[key]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                        style={inputStyle(key)}
                      />
                    )}
                    {errors[key] && (
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--color-expense)",
                          marginTop: "4px",
                        }}
                      >
                        {errors[key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                <button
                  onClick={() => dispatch(closeModal())}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "0.5px solid var(--color-border)",
                    background: "none",
                    color: "var(--color-text-secondary)",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#f97316",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {editing ? "Save changes" : "Add transaction"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
