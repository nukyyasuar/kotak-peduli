import { components } from "react-select";
import { useEffect } from "react";

export default function CustomMenuChecklist(props) {
  const {
    selectProps: {
      selectedOptions,
      toggleOption,
      showOther,
      setShowOther,
      otherText,
      setOtherText,
      options,
    },
  } = props;

  useEffect(() => {
    if (!selectedOptions.find((o) => o.value === "lainnya")) {
      setOtherText("");
      setShowOther(false);
    }
  }, [selectedOptions]);

  return (
    <components.Menu {...props}>
      <div className="p-2 max-h-60 overflow-y-auto space-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#543a14] hover:text-white cursor-pointer"
            onClick={(e) => {
              toggleOption(opt);
              e.preventDefault();
            }}
          >
            <input
              type="checkbox"
              checked={selectedOptions.some((sel) => sel.value === opt.value)}
              onChange={() => toggleOption(opt)}
              className="accent-[#F0BB78]"
            />
            {opt.label}
          </label>
        ))}
        {showOther && (
          <input
            type="text"
            className="mt-2 w-full border px-2 py-1 text-sm rounded"
            placeholder="Tulis tipe barang lainnya"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()} // tambahkan ini
          />
        )}
      </div>
    </components.Menu>
    // <components.Option {...props}>
    //   <input type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
    //   <label>{props.label}</label>
    // </components.Option>
  );
}
