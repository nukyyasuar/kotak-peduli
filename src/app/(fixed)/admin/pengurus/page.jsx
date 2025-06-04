"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClipLoader } from "react-spinners";

import { getProfile } from "src/services/api/profile";
import {
  getMembersWithParams,
  createUpdateMember,
  deleteMember,
  getAllRole,
} from "src/services/api/member";
import { getPosts } from "src/services/api/post";
import memberSchema from "src/components/schema/memberSchema";
import { useAccess } from "src/services/auth/acl";

import Unauthorize from "src/components/unauthorize";
import { FormInput } from "src/components/formInput";
import handleOutsideModal from "src/components/handleOutsideModal";
import { ButtonCustom } from "src/components/button";
import { memberRolesList } from "src/components/options";
import FilterCheckboxDonationTable from "src/components/donationItems/FilterCheckboxDonationTable";

export default function CollectionCenterMembers() {
  const deleteMemberModalRef = useRef(null);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tempSelectedMemberRolesFilters, setTempSelectedMemberRolesFilters] =
    useState([]);
  const [selectedMemberRolesFilters, setSelectedMemberRolesFilters] = useState(
    []
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [isDeleteMemberModalOpen, setIsDeleteMemberModalOpen] = useState(false);
  const isFirstFetchMembers = useRef(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [dataMembers, setDataMembers] = useState([]);
  const [selectedDataMember, setSelectedDataMember] = useState(null);
  const [memberRolesListData, setMemberRolesListData] = useState([]);
  const [dataPosts, setDataPosts] = useState([]);
  const [isLoadingCreateMember, setIsLoadingCreateMember] = useState(false);
  const [isLoadingDeleteMember, setIsLoadingDeleteMember] = useState(false);
  const [isLoadingFetchMembers, setIsLoadingFetchMembers] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedMemberRoleName, setSelectedMemberRoleName] = useState(null);
  const [profileUserRole, setProfileUserRole] = useState(null);

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(memberSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      penempatan: null,
      role: null,
    },
  });
  const canReadRole = useAccess("READ_ROLE");

  const totalSelectedFiltersCount = selectedMemberRolesFilters?.length;
  const isCanEdit =
    selectedUserId !== profileUserRole?.userId &&
    !(
      profileUserRole?.roleName === "Collection Center Role Admin" &&
      (selectedMemberRoleName === "Collection Center Admin" ||
        selectedMemberRoleName === "Collection Center Role Admin")
    );

  const isAdmin = profileUserRole?.roleName === "Collection Center Role Admin";
  const memberRoleListDataFormatted = memberRolesListData
    .filter((item) => {
      if (!isAdmin) return true;
      return (
        item.name !== "Collection Center Admin" &&
        item.name !== "Collection Center Role Admin"
      );
    })
    .map((item) => {
      const matchMemberRole = memberRolesList.find(
        (role) => role.value === item.name
      );

      return {
        label: matchMemberRole?.label || item.name,
        value: item.id,
        name: item.name,
      };
    });

  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("collectionCenterId");
    }
    return null;
  };
  const collectionCenterId = getInitialValue();

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  // Modal Handling Outside
  handleOutsideModal({
    ref: deleteMemberModalRef,
    isOpen: isDeleteMemberModalOpen,
    onClose: () => {
      setIsDeleteMemberModalOpen(false);
      reset();
    },
  });

  const handleTempMemberRoleFilterChange = (value) => {
    setTempSelectedMemberRolesFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApplyFilters = () => {
    setSelectedMemberRolesFilters(tempSelectedMemberRolesFilters);
    setCurrentPage(1);
    fetchMembers(1, debouncedSearch, tempSelectedMemberRolesFilters);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedMemberRolesFilters([]);
    setTempSelectedMemberRolesFilters([]);
    setCurrentPage(1);
    fetchMembers(1, "", []);
  };

  const fetchProfile = async () => {
    try {
      const profileData = await getProfile();
      setProfileUserRole({
        userId: profileData?.id,
        roleName: profileData?.collectionCenterCollaborator?.role?.name,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Gagal memuat data profil");
    }
  };
  const fetchMembers = async (page, search) => {
    try {
      setIsLoadingFetchMembers(true);

      const result = await getMembersWithParams(
        collectionCenterId,
        page,
        search,
        selectedMemberRolesFilters
      );

      setDataMembers(result.data);
      setTotalPages(result.meta.totalPages);
      setTotalData(result.meta.total);

      if (isFirstFetchMembers.current) {
        // toast.success("Data pengurus berhasil dimuat");
        isFirstFetchMembers.current = false;
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Gagal memuat data pengurus");
    } finally {
      setIsLoadingFetchMembers(false);
    }
  };

  const fetchAllRoles = async () => {
    try {
      const result = await getAllRole(collectionCenterId);
      setMemberRolesListData(result.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Gagal memuat data role");
    }
  };

  const onSubmitMember = async (data) => {
    const payload = {
      user: [
        {
          email: data.email,
          roleId: data.role.value,
          ...(data.penempatan?.label && {
            title: data.penempatan.label,
          }),
        },
      ],
    };

    const isEdit = isEditMemberModalOpen;

    try {
      setIsLoadingCreateMember(true);

      await createUpdateMember(collectionCenterId, payload);

      toast.success(
        isEdit
          ? "Data pengurus berhasil diubah"
          : "Data pengurus berhasil ditambahkan"
      );
      isEdit ? setIsEditMemberModalOpen(false) : setIsAddMemberModalOpen(false);
      reset();
      fetchMembers(currentPage, debouncedSearch, selectedMemberRolesFilters);
    } catch (error) {
      console.error("Error submitting member:", error);

      if (!isEdit && error.message === "Resource not found") {
        toast.error("Email yang dipilih tidak terdaftar");
      } else {
        toast.error(
          isEdit ? "Gagal mengubah pengurus" : "Gagal menambahkan pengurus"
        );
      }
    } finally {
      setIsLoadingCreateMember(false);
    }
  };

  const onDeleteMember = async () => {
    try {
      setIsLoadingDeleteMember(true);

      await deleteMember(collectionCenterId, selectedMemberId);

      toast.success("Data pengurus berhasil dihapus");
      setIsDeleteMemberModalOpen(false);
      reset();
      fetchMembers(currentPage, debouncedSearch, selectedMemberRolesFilters);
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Gagal menghapus pengurus");
    } finally {
      setIsLoadingDeleteMember(false);
    }
  };

  const fetchPosts = async (collectionCenterId) => {
    try {
      const results = await getPosts(collectionCenterId);
      if (results.length > 0) {
        const formattedPosts = results.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setDataPosts(formattedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Gagal memuat data cabang / drop point");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchKeyword]);

  useEffect(() => {
    if (isEditMemberModalOpen && selectedMemberId) {
      dataMembers.forEach((member) => {
        if (member.id === selectedMemberId) {
          setSelectedDataMember(member);
          reset({
            email: member.user.email,
            penempatan: dataPosts?.find((post) => post.label === member.title),
            role:
              memberRoleListDataFormatted?.find(
                (role) => role.name === member.role?.name
              ) || null,
          });
        }
      });
    }
  }, [isEditMemberModalOpen, selectedMemberId]);

  useEffect(() => {
    if (isDeleteMemberModalOpen && selectedMemberId) {
      dataMembers.forEach((member) => {
        if (member.id === selectedMemberId) {
          setSelectedDataMember(member);
        }
      });
    }
  }, [isDeleteMemberModalOpen, selectedMemberId]);

  useEffect(() => {
    if (!canReadRole) return;

    fetchMembers(currentPage, debouncedSearch, selectedMemberRolesFilters);
  }, [currentPage, debouncedSearch, selectedMemberRolesFilters, canReadRole]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedMemberRolesFilters]);

  useEffect(() => {
    if (!canReadRole) return;

    fetchAllRoles();
  }, [canReadRole]);

  useEffect(() => {
    if (!canReadRole) return;

    fetchPosts(collectionCenterId);
  }, [collectionCenterId, canReadRole]);

  return (
    <div className="min-h-[92dvh] bg-[#F5E9D4] py-12">
      {!canReadRole ? (
        <Unauthorize />
      ) : (
        <main className="max-w-[1200px] mx-auto space-y-4 text-black">
          <h1 className="text-[32px] text-[#543A14] font-bold text-center">
            PENGURUS
          </h1>

          {/* Fitur Tabel */}
          <div className="flex justify-between items-center mb-4">
            {/* Search */}
            <div className="relative">
              <FormInput
                inputType="text"
                placeholder="Cari nama / email pengurus"
                inputStyles="bg-white w-3xs relative pl-10"
                value={searchKeyword}
                onChange={(keyword) => {
                  setSearchKeyword(keyword);
                }}
              />
              <Icon
                icon="cuida:search-outline"
                width={24}
                height={24}
                color="#C2C2C2"
                className="absolute top-1/2 -translate-y-1/2 left-2"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Filter */}
              <div className="relative">
                {/* Button Filter */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`border border-[#C2C2C2] rounded-lg px-3 h-12 flex items-center justify-between ${totalSelectedFiltersCount ? "bg-[#543A14] text-white" : "bg-white text-[#C2C2C2]"}`}
                >
                  <span className="mr-1">
                    {totalSelectedFiltersCount || null}
                  </span>{" "}
                  Filter
                  <Icon
                    icon="mdi:chevron-down"
                    width={24}
                    height={24}
                    color="#C2C2C2"
                  />
                </button>

                {/* Modal(Dropdown) Filter */}
                {isFilterOpen && (
                  <div className="absolute right-0 mt-4 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <div className="p-4">
                      {/* Input Checkbox Filter */}
                      <div className="mb-4 max-h-50 overflow-scroll">
                        <FilterCheckboxDonationTable
                          title="Role"
                          items={memberRolesList}
                          selected={tempSelectedMemberRolesFilters}
                          onChange={handleTempMemberRoleFilterChange}
                        />
                      </div>
                      <div className="flex justify-between">
                        <button
                          onClick={handleApplyFilters}
                          className="bg-[#4A3F35] text-white px-4 py-2 rounded-lg"
                        >
                          Filter
                        </button>
                        <button
                          onClick={() => {
                            handleResetFilters();
                            setIsFilterOpen(false);
                          }}
                          className="text-gray-700 px-4 py-2 rounded-lg"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Button Tambah Pengurus */}
              <ButtonCustom
                label="Tambah Data"
                variant="brown"
                icon="material-symbols:add"
                onClick={() => {
                  setIsAddMemberModalOpen(true);
                }}
              />
            </div>
          </div>

          {/* Tabel Pengurus */}
          <div
            className={`bg-white p-6 rounded-lg ${totalData <= 0 && "text-center"}`}
          >
            {isLoadingFetchMembers ? (
              <div className="flex justify-center">
                <ClipLoader
                  color="#543A14"
                  size={30}
                  loading={isLoadingFetchMembers}
                />
              </div>
            ) : totalData === 0 ? (
              "Data tidak ditemukan"
            ) : (
              <table className="w-full bg-white rounded-lg">
                <thead>
                  <tr className="text-left border-b border-b-[#EDEDED]">
                    <th className="pb-2">Nama</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">No. Telepon</th>
                    <th className="pb-2">Penempatan</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Menu</th>
                  </tr>
                </thead>

                <tbody>
                  {dataMembers.map((item, index) => {
                    const user = item?.user;

                    const fullName = `${user?.firstName} ${user?.lastName}`;

                    const role = memberRolesList.find(
                      (member) => member.value === item?.role?.name
                    )?.label;

                    return (
                      <tr key={index} className="border-b border-b-[#EDEDED]">
                        <td className="py-3">{fullName}</td>
                        <td className="py-3">{user?.email}</td>
                        <td className="py-3">{user?.phoneNumber}</td>
                        <td className="py-3">
                          {item.title || "Tempat Penampung"}
                        </td>
                        <td className="py-3">{role}</td>
                        <td className="py-3 relative text-start">
                          <button
                            onClick={() => {
                              toggleMenu(index);
                              setSelectedUserId(item.userId);
                              setSelectedMemberId(item.id);
                              setSelectedMemberRoleName(item.role?.name);
                            }}
                            className={`border border-[#C2C2C2] rounded-sm p-1`}
                          >
                            <Icon
                              icon="iconamoon:menu-burger-vertical"
                              width={16}
                              height={16}
                              color="black"
                              className="rotate-90"
                            />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuIndex === index && (
                            <div className="w-35 absolute left-0 mt-1 bg-white border border-[#543A14] rounded-lg shadow-lg z-10">
                              <ul className="py-2">
                                {isCanEdit ? (
                                  <>
                                    <li
                                      className="text-left px-3 py-1 text-gray-700 hover:bg-[#543A14] hover:text-white cursor-pointer"
                                      onClick={() => {
                                        setSelectedMemberId(item.id);
                                        setIsEditMemberModalOpen(true);
                                        setOpenMenuIndex(null);
                                      }}
                                    >
                                      Ubah Data
                                    </li>
                                    <li
                                      className="text-left px-3 py-1 text-gray-700 hover:bg-[#543A14] hover:text-white cursor-pointer"
                                      onClick={() => {
                                        setSelectedMemberId(item.id);
                                        setIsDeleteMemberModalOpen(true);
                                        setOpenMenuIndex(null);
                                      }}
                                    >
                                      Hapus Data
                                    </li>
                                  </>
                                ) : (
                                  <li className="text-left px-3 py-1 text-gray-700 cursor-not-allowed text-sm">
                                    Tidak dapat mengubah data ini
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalData > 0 && (
            <div className="flex justify-end space-x-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-[#543A14] disabled:text-[#C2C2C2]"
              >
                {"< Previous"}
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === index + 1
                      ? "bg-[#4A3F35] text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 text-gray-700 hover:text-gray-900 disabled:text-gray-300"
              >
                Next {">"}
              </button>
            </div>
          )}
        </main>
      )}

      {/* Modal Tambah & Ubah Pengurus */}
      {(isAddMemberModalOpen || isEditMemberModalOpen) && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 space-y-6 text-black max-w-[640px] w-full min-w-135 overflow-y-auto max-h-[90vh]">
            <h1 className="font-bold text-xl">
              {isEditMemberModalOpen ? "Ubah Data Pengurus" : "Tambah Pengurus"}
            </h1>

            <form onSubmit={handleSubmit(onSubmitMember)}>
              <div className="space-y-3 mb-6">
                <FormInput
                  inputType="text"
                  type="email"
                  name="email"
                  register={register("email")}
                  value={watch("email")}
                  label="Email"
                  placeholder="Contoh: user@example.com"
                  errors={errors?.email?.message}
                  required
                  disabled={isEditMemberModalOpen}
                />
                <FormInput
                  key={collectionCenterId}
                  type="dynamic"
                  inputType="dropdownInput"
                  label="Penempatan"
                  name="penempatan"
                  control={control}
                  options={dataPosts}
                  placeholder="Pilih cabang / drop point yang sesuai"
                  disabled={dataPosts?.length === 0}
                  onChange={(selected) => {
                    setValue("penempatan", selected);
                  }}
                />
                <FormInput
                  type="dynamic"
                  label="Role"
                  inputType="dropdownInput"
                  name="role"
                  options={memberRoleListDataFormatted}
                  control={control}
                  placeholder="Pilih role yang sesuai"
                  required
                  onChange={(selected) => {
                    setValue("role", selected);
                  }}
                  errors={errors.role?.message}
                />
              </div>

              <div className="flex gap-3">
                <ButtonCustom
                  label={
                    isLoadingCreateMember ? (
                      <ClipLoader
                        size={20}
                        color="white"
                        loading={isLoadingCreateMember}
                      />
                    ) : isEditMemberModalOpen ? (
                      "Simpan"
                    ) : (
                      "Kirim"
                    )
                  }
                  variant="brown"
                  type="submit"
                  className="w-full"
                  disabled={isLoadingCreateMember}
                />
                <ButtonCustom
                  label="Batal"
                  variant="outlineBrown"
                  type="button"
                  className="w-full"
                  onClick={() => {
                    isEditMemberModalOpen
                      ? setIsEditMemberModalOpen(false)
                      : setIsAddMemberModalOpen(false);
                    reset({
                      email: "",
                      penempatan: null,
                      role: null,
                    });
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus Pengurus */}
      {isDeleteMemberModalOpen && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
          <div
            ref={deleteMemberModalRef}
            className="bg-white rounded-lg p-8 space-y-6 text-black max-w-[640px] min-w-135 overflow-y-auto max-h-[90vh]"
          >
            <h1 className="font-bold text-xl">Hapus Data Pengurus</h1>
            <p>
              Administrator yang telah di{" "}
              <span className="font-bold">HAPUS</span> akan kehilangan akses
              kedalam tampilan dashboard tempat penampung.{" "}
              <span>
                Apakah Anda yakin ingin menghapus administrator terkait?
              </span>
            </p>

            <div>
              <ButtonCustom
                label={
                  isLoadingDeleteMember ? (
                    <ClipLoader
                      size={20}
                      color="white"
                      loading={isLoadingDeleteMember}
                    />
                  ) : (
                    "Konfirmasi"
                  )
                }
                variant="brown"
                className="w-full"
                type="button"
                onClick={onDeleteMember}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
