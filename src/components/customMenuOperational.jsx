"use client";

import { useState } from "react";
import Select from "react-select";
import { ButtonCustom } from "./button";

const customStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.menuIsOpen || state.selectValue ? "#543A14" : "#C2C2C2",
    borderRadius: "0.5rem",
    padding: "0 20px",
    width: "100%",
    minHeight: "48px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#543A14",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#C2C2C2",
  }),
  singleValue: (base) => ({
    ...base,
    color: "black",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 20,
    borderRadius: "8px",
    border: "1px solid #543A14",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: 0,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#543A14" : "white",
    color: state.isFocused ? "white" : "black",
    "&:active": {
      backgroundColor: "#543A14",
      color: "white",
    },
  }),
};

const CustomMenuOperational = ({ watch }) => {
  const [hari, setHari] = useState("");
  const [jamBuka, setJamBuka] = useState("");
  const [menitBuka, setMenitBuka] = useState("");
  const [jamTutup, setJamTutup] = useState("");
  const [menitTutup, setMenitTutup] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const formatOptions = (arr) => arr.map((val) => ({ value: val, label: val }));
  const waktuOperasional = watch("waktuOperasional") || [];
  const hariOptions = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];
  const jamOptions = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const menitOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const handleTambah = () => {
    if (hari && jamBuka && menitBuka && jamTutup && menitTutup) {
      const waktuBaru = {
        hari,
        buka: `${jamBuka}:${menitBuka}`,
        tutup: `${jamTutup}:${menitTutup}`,
      };
      setValue("waktuOperasional", [...(waktuOperasional || []), waktuBaru]);
      setHari("");
      setJamBuka("");
      setMenitBuka("");
      setJamTutup("");
      setMenitTutup("");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-3 border border-[#543A14] mt-1 space-y-3">
      cek
    </div>
  );
};

export default CustomMenuOperational;
