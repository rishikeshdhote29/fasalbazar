import React from "react";

// Order tracking steps
const steps = [
  { id: 1, label: "Order Placed", date: "2026-05-01", status: "completed" },
  { id: 2, label: "Processing", date: "2026-05-02", status: "completed" },
  { id: 3, label: "Shipped", date: "2026-05-03", status: "current" },
  { id: 4, label: "Out for Delivery", date: null, status: "upcoming" },
  { id: 5, label: "Delivered", date: null, status: "upcoming" },
];

export default function OrderTracking() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Tracking</h2>
      <ol className="relative border-l border-gray-300">
        {steps.map((step, index) => (
          <li key={step.id} className="mb-10 ml-6">
            {/* Circle Indicator */}
            <span
              className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-white ${
                step.status === "completed"
                  ? "bg-green-500"
                  : step.status === "current"
                  ? "bg-blue-500 animate-pulse"
                  : "bg-gray-300"
              }`}
            >
              {step.status === "completed" && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>

            {/* Step Content */}
            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
              {step.label}
              {step.status === "current" && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded">
                  In Progress
                </span>
              )}
            </h3>
            {step.date && (
              <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
                {step.date}
              </time>
            )}
            <p className="text-base font-normal text-gray-600">
              {step.status === "completed"
                ? "This step has been completed."
                : step.status === "current"
                ? "Your order is currently here."
                : "This step is pending."}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
