"use client";

import Select from "react-select";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";

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
    flexWrap: "nowrap",
    overflowX: "auto",
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

const baseClass =
  "border border-[#C2C2C2] rounded-lg px-5 py-3 min-h-12 resize-none focus:outline-none focus:border-black placeholder:text-[#C2C2C2] text-base w-full";
const disabledClass = "bg-[#EDEDED] cursor-not-allowed";

const FormInput = ({
  name,
  value,
  onChange,
  placeholder,
  options = [],
  label,
  className,
  inputType,
  register,
  control,
  onClick,
  ref,
  model,
  type,
  togglePassword,
  showPassword,
  accept,
  inputStyles,
  isAutocomplete,
  disabled,
  customMenu,
  setValue,
  errors,
  key,
  onMenuOpen,
  required,
  customValueRender,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // inputType === dropdown || dropdownInput
  const mappedValue = Array.isArray(options)
    ? options.find((opt) => (opt.value ?? opt) === value)
    : [];
  const formattedOptions = Array.isArray(options)
    ? options.map((opt) =>
        typeof opt === "string" ? { label: opt, value: opt } : opt
      )
    : [];
  // END

  return (
    <>
      <div className={`flex flex-col gap-1 ${className}`}>
        {label && (
          <label className="text-base font-bold">
            {label}
            {required && <span className="text-[#E52020]">*</span>}
          </label>
        )}

        {inputType === "dropdown" && (
          <Select
            isSearchable={false}
            name={name}
            value={mappedValue}
            onChange={(selected) => onChange(selected?.value)}
            options={formattedOptions}
            noOptionsMessage={() => "Belum ada opsi"}
            placeholder={placeholder}
            onMenuOpen={() => setIsOpen(true)}
            onMenuClose={() => setIsOpen(false)}
            styles={customStyles}
            components={{
              DropdownIndicator: () => (
                <Icon
                  icon="ep:arrow-up-bold"
                  width={16}
                  height={16}
                  className={`${isOpen ? "rotate-180 text-black" : "text-[#C2C2C2]"}`}
                />
              ),
              IndicatorSeparator: () => null,
            }}
          />
        )}

        {inputType === "dropdownInput" && (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                key={key}
                isMulti={type === "checkbox"}
                isSearchable={true}
                isDisabled={disabled}
                value={
                  type === "checkbox"
                    ? formattedOptions.filter((opt) =>
                        field.value?.includes(opt.value)
                      )
                    : type === "dynamic"
                      ? field.value
                      : formattedOptions.find(
                          (opt) => opt.value === field.value
                        )
                }
                onChange={
                  type === "checkbox"
                    ? (selected) => {
                        const value = selected.map((option) => option.value);
                        field.onChange(value);
                        onChange?.(value);
                      }
                    : (selected) => {
                        field.onChange(selected?.value);
                        onChange?.(selected);
                      }
                }
                options={formattedOptions}
                placeholder={placeholder}
                styles={customStyles}
                onMenuOpen={onMenuOpen}
                onMenuClose={() => {
                  if (isOpen) setIsOpen(false);
                }}
                components={{
                  DropdownIndicator: () => (
                    <Icon
                      icon="ep:arrow-up-bold"
                      width={16}
                      height={16}
                      className={`${
                        isOpen ? "rotate-180 text-black" : "text-[#C2C2C2]"
                      }`}
                    />
                  ),
                  IndicatorSeparator: () => null,
                  ...(customMenu && { Menu: customMenu }),
                }}
                className={inputStyles}
              />
            )}
          />
        )}

        {inputType === "dropdownCustomOptions" && (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isSearchable={false}
                value={null}
                onChange={() => {}}
                placeholder={placeholder}
                styles={customStyles}
                menuIsOpen={isOpen}
                onMenuOpen={() => setIsOpen(true)}
                onMenuClose={() => setIsOpen(false)}
                components={{
                  Menu: customMenu,
                  DropdownIndicator: () => (
                    <Icon
                      icon="ep:arrow-up-bold"
                      width={16}
                      height={16}
                      className={`transition-transform ${
                        isOpen ? "rotate-180 text-black" : "text-[#C2C2C2]"
                      }`}
                    />
                  ),
                  IndicatorSeparator: () => null,
                }}
              />
            )}
          />
        )}

        {inputType === "dropdownChecklistOther" && (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <CreatableSelect
                {...field}
                isMulti
                options={options}
                menuIsOpen={isOpen}
                onMenuOpen={() => setIsOpen(true)}
                onMenuClose={() => setIsOpen(false)}
                placeholder={placeholder}
                onChange={(selected) => field.onChange(selected)}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={customStyles}
                components={{
                  DropdownIndicator: () => (
                    <Icon
                      icon="ep:arrow-up-bold"
                      width={16}
                      height={16}
                      className={`transition-transform ${
                        isOpen ? "rotate-180 text-black" : "text-[#C2C2C2]"
                      }`}
                    />
                  ),
                  IndicatorSeparator: () => null,
                }}
              />
            )}
          />
        )}

        {inputType === "textArea" && (
          <textarea
            ref={ref}
            name={name}
            value={value}
            onChange={(e) => {
              onChange?.(e.target.value);
            }}
            placeholder={placeholder}
            className={`${baseClass} ${inputStyles} flex-1`}
            onClick={onClick}
            readOnly={label.toLowerCase().includes("alamat")}
            {...register}
          />
        )}

        <div className="relative">
          {inputType === "text" && (
            <input
              ref={ref}
              type={type ?? "text"}
              accept={accept}
              name={name}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              className={`${baseClass} ${inputStyles} ${value && `border-black`} ${disabled ? disabledClass : ""} max-h-12`}
              onClick={onClick}
              disabled={disabled}
              {...register}
            />
          )}
          {togglePassword && (
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-3 text-[#C2C2C2] hover:text-black transition z-20"
            >
              <Icon
                icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                width={24}
              />
            </button>
          )}
        </div>

        {inputType === "controlledText" && (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                ref={(el) => {
                  field.ref(el);
                  if (ref) ref.current = el;
                }}
                defaultValue={
                  isAutocomplete ? undefined : (value ?? field.value)
                }
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.(e.target.value);
                }}
                placeholder={placeholder}
                className={`${baseClass} ${disabled ? disabledClass : ""}`}
                onClick={onClick}
                disabled={disabled}
              />
            )}
          />
        )}

        {inputType === "custom" && (
          <div
            className={`${baseClass} ${inputStyles} ${disabled ? disabledClass : ""}`}
          >
            {customValueRender?.()}
          </div>
        )}

        {errors && (!label || !label.toLowerCase().includes("foto")) && (
          <p className="text-[#E52020] text-sm">{errors}</p>
        )}
      </div>
    </>
  );
};

export { FormInput };
