{
  /* <div className="flex-1 mr-2">
                      <label className="block mb-1 font-bold text-gray-700">
                        Event
                      </label>
                      <div className="relative">
                        <select
                          className="w-full appearance-none border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-400 bg-white focus:outline-none"
                          // value={formData.items[index]?.event || ""}
                          // onChange={(e) =>
                          //   handleItemChange(index, "event", e.target.value)
                          // }
                        >
                          <option value="">
                            Pilih event tujuan donasi (jika tersedia)
                          </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <Icon icon="mdi:chevron-down" className="h-5 w-5" />
                        </div>
                      </div>
                    </div> */
}
{
  /* <button
                    type="button"
                    className="bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center"
                    // onClick={() => removeDonationItem(index)}
                  >
                    <Icon icon="mdi:close" className="h-5 w-5" />
                  </button> */
}
{
  /* <div className="flex justify-between items-center mb-4">
                    <div className="flex-1 mr-2">
                      <label className="block mb-1 font-bold text-gray-700">
                        Jumlah Barang
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                        // value={formData.items[index]?.jumlah || ""}
                        // onChange={(e) =>
                        //   handleItemChange(index, "jumlah", e.target.value)
                        // }
                        placeholder="Contoh: 20"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block mb-1 font-bold text-gray-700">
                        Total Berat Barang (kg)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md p-2 text-gray-700 pr-10"
                          // value={formData.items[index]?.berat || ""}
                          // onChange={(e) =>
                          //   handleItemChange(index, "berat", e.target.value)
                          // }
                          placeholder="Contoh: 10"
                        />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
                          kg
                        </span>
                      </div>
                    </div>
                  </div> */
}

{
  /* <div className="flex items-center">
                    <div className="flex-1 mr-2">
                      <label className="block mb-1 font-bold text-gray-700">
                        Foto Barang
                      </label>
                      <input
                        type="file"
                        // ref={(el) => (fileInputRefs.current[index] = el)}
                        className="hidden"
                        accept=".jpg,.png"
                        // onChange={(e) => handleFileChange(index, e)}
                      />
                      <div className="flex items-center">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                          // value={fileNames[index] || ".jpg, .png"}
                          readOnly
                        />
                        <button
                          type="button"
                          className="ml-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-md"
                          // onClick={() => handleFileButtonClick(index)}
                        >
                          Pilih file
                        </button>
                      </div>
                    </div>
                  </div> */
}

{
  /* Form Detail Barang */
}
{
  selectedDonationType.length !== 0 && (
    <div className="bg-[#FFF0DC] px-5 pb-5 rounded-lg mb-3">
      {/* Jenis Barang */}
      <div className="w-full flex justify-center mb-3">
        <p className="text-base font-bold text-white bg-[#543a14] text-center px-6 py-2 w-fit rounded-b-lg">
          {selectedDonationType.label}
        </p>
      </div>
      <div className="space-y-3">
        {/* Total & Berat Barang */}
        <div className="flex gap-5">
          <FormInput
            label="Jumlah Barang"
            inputType="text"
            placeholder="Contoh: 20"
            register={register("jumlahBarang")}
          />
          <FormInput
            label="Total Berat Barang (kg)"
            inputType="text"
            placeholder="Contoh: 10"
            register={register("beratBarang")}
          />
        </div>
        <div className="flex gap-5 items-center">
          {/* Foto Barang */}
          <div className="flex items-end gap-3 flex-1">
            <FormInput
              inputType="text"
              placeholder=".jpg, .png"
              label="Foto Barang"
              className="pointer-events-none"
              value={watch("fotoBarang")}
            />
            <div className="flex">
              <label
                htmlFor="fotoBarang"
                className="px-4 py-3 bg-[#F0BB78] text-nowrap rounded-lg font-semibold text-white"
              >
                Pilih File
              </label>
              <input
                id="fotoBarang"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setValue("fotoBarang", e.target.files[0].name);
                  console.log(e.target.value);
                }}
              />
            </div>
          </div>
          {/* Event */}
          <FormInput
            inputType="dropdownInput"
            label="Event"
            name="event"
            control={control}
            options={dummyOptions}
            placeholder="Pilih event tujuan donasi (jika tersedia)"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}

{
  /* Form Detail Barang */
}
{
  /* {donationItems.map((_, index) => (
              <div key={index} className="bg-[#FFF7E6] p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1 mr-2">
                    <label className="block mb-1 font-bold text-gray-700">
                      Event
                    </label>
                    <div className="relative">
                      <select
                        className="w-full appearance-none border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-400 bg-white focus:outline-none"
                        value={formData.items[index]?.event || ""}
                        onChange={(e) =>
                          handleItemChange(index, "event", e.target.value)
                        }
                      >
                        <option value="">
                          Pilih event tujuan donasi (jika tersedia)
                        </option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <Icon icon="mdi:chevron-down" className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center"
                    onClick={() => removeDonationItem(index)}
                  >
                    <Icon icon="mdi:close" className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1 mr-2">
                    <label className="block mb-1 font-bold text-gray-700">
                      Jumlah Barang
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                      value={formData.items[index]?.jumlah || ""}
                      onChange={(e) =>
                        handleItemChange(index, "jumlah", e.target.value)
                      }
                      placeholder="Contoh: 20"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-bold text-gray-700">
                      Total Berat Barang (kg)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 text-gray-700 pr-10"
                        value={formData.items[index]?.berat || ""}
                        onChange={(e) =>
                          handleItemChange(index, "berat", e.target.value)
                        }
                        placeholder="Contoh: 10"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
                        kg
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-1 mr-2">
                    <label className="block mb-1 font-bold text-gray-700">
                      Foto Barang
                    </label>
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      className="hidden"
                      accept=".jpg,.png"
                      onChange={(e) => handleFileChange(index, e)}
                    />
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                        value={fileNames[index] || ".jpg, .png"}
                        readOnly
                      />
                      <button
                        type="button"
                        className="ml-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-md"
                        onClick={() => handleFileButtonClick(index)}
                      >
                        Pilih file
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))} */
}
