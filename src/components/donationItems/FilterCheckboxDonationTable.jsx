import { useState, useEffect } from "react";

const FilterCheckboxDonationTable = ({
  title,
  items,
  selected,
  onChange,
  search,
}) => {
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    const filteredItems = items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredItems(filteredItems);
  }, [search, items]);

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      {filteredItems.map((item) => (
        <label key={item.value} className="flex items-center mb-2">
          <input
            type="checkbox"
            value={item.value}
            checked={selected.includes(item.value)}
            onChange={() => onChange(item.value)}
            className="peer w-4 h-4 mr-2 accent-[#543A14]"
            id={`${title}-${item.value}`}
          />
          {item.label}
        </label>
      ))}
    </div>
  );
};

export default FilterCheckboxDonationTable;
