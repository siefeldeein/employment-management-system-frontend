import { useUIStore } from "../store/uiStore";

export default function Toasts() {
  const { toasts, removeToast } = useUIStore();
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={
            "rounded px-4 py-3 text-white shadow-lg cursor-pointer " +
            (toast.type === "success" ? "bg-green-600" : "bg-red-600")
          }
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
