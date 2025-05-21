"use client";

import React, { useState } from "react";
// import "./styles.css";
import Select, { components } from "react-select";

const alphabet = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
  { value: "d", label: "D" },
  { value: "e", label: "E" },
  { value: "f", label: "F" },
  { value: "g", label: "G" },
  { value: "h", label: "H" },
  { value: "i", label: "I" },
  { value: "j", label: "J" },
];

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>

      <input type="text" className="border border-black" />
    </div>
  );
};

function App() {
  const [state, setState] = useState({ optionSelected: null });

  const handleChange = (selected) => {
    setState({
      optionSelected: selected,
    });
  };

  return (
    <div>
      <h3>MultiSelect dropdown with Checkbox</h3>
      <Select
        isSearchable={false}
        options={alphabet}
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{
          Option,
        }}
        onChange={handleChange}
        value={state.optionSelected}
        // Hide dropdown list  when select any item
        // closeMenuOnSelect={true}

        //Selected Item Remove in dropdown list
        // hideSelectedOptions={true}
      />
    </div>
  );
}

export default App;
