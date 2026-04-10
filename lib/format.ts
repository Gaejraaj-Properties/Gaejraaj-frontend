export function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatArea(value: number, unit: string): string {
  return `${value.toLocaleString("en-IN")} ${unit}`;
}

export function getListingTypeLabel(type: string): string {
  const map: Record<string, string> = { sale: "For Sale", rent: "For Rent", lease: "For Lease" };
  return map[type] || type;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    sold: "bg-purple-100 text-purple-800",
    rented: "bg-blue-100 text-blue-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}
