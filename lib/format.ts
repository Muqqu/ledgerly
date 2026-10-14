export const pkr = (n: number) => "Rs " + Math.round(n).toLocaleString("en-PK");
export const shortPkr = (n: number) => n >= 1e6 ? `Rs ${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `Rs ${(n / 1e3).toFixed(0)}k` : `Rs ${n}`;
export const date = (s: string) => new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
