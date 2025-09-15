// app/fonts/poppins.ts
import { Poppins } from "next/font/google";

export const POPPINS = Poppins({
  weight: ["100","200","300","400","500","600","700","800","900"], // choose the weights you need
  style: ["normal", "italic"], // include italic if needed
  subsets: ["latin"],          // choose subsets you need
  display: "swap",
  variable: "--font-poppins",  // optional for CSS variable usage
});
