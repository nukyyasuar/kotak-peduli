import { useState, useRef } from "react";
import Image from "next/image";
import { ClipLoader } from "react-spinners";

import { ButtonCustom } from "src/components/button";
import { TextBetween, ListTextWithTitle } from "src/components/text";
import AttachmentImage from "src/components/attachmentImage";
import {
  statusList,
  donationTypes,
  shippingTypes,
} from "src/components/options";
import FormattedWIBDate from "src/components/dateFormatter";
import handleOutsideModal from "src/components/handleOutsideModal";

const ModalDetailDonation = ({
  isOpen,
  detailModalRef,
  imgSrc,
  setImgSrc,
  handleImageLoaded,
  setIsShippingDateModalOpen,
  setIsUpdateStatusModalOpen,
  STATUS_GREEN,
  STATUS_RED,
  detailDonation,
  isFetchDetailDonationLoading,
  userRole,
  setIsOpenProofModal,
}) => {
  const largeImageModalRef = useRef(null);
  const [isModalLargeImageOpen, setIsModalLargeImageOpen] = useState(false);
  const distributionProofModalRef = useRef(null);
  const [isDistributionProofModalOpen, setIsDistributionProofModalOpen] =
    useState(false);

  const latestStatus = detailDonation?.approvals?.latestStatus;
  const statusGreenDetailDonation = STATUS_GREEN.includes(latestStatus);
  const statusRedDetailDonation = STATUS_RED.includes(latestStatus);
  const statusColor = statusGreenDetailDonation
    ? "bg-[#1F7D53]"
    : statusRedDetailDonation
      ? "bg-[#E52020]"
      : "bg-[#543A14]";
  const shelterShippingDate = detailDonation?.pickupDate;
  const donorShippingDate = detailDonation?.userAvailability;
  const rejectedRedirectedNote =
    detailDonation?.approvals?.approvalDetails?.find(
      (item) => item.status === "REJECTED" || item.status === "REDIRECTED"
    )?.notes;

  const rescheduleNotes =
    detailDonation?.approvals?.approvalDetails[0]?.status === "CONFIRMING" &&
    detailDonation?.approvals?.approvalDetails[0]?.notes
      ? detailDonation?.approvals?.approvalDetails[0]?.notes
      : "";

  handleOutsideModal({
    ref: isDistributionProofModalOpen
      ? distributionProofModalRef
      : largeImageModalRef,
    isOpen: isDistributionProofModalOpen || isModalLargeImageOpen,
    onClose: () => {
      if (isDistributionProofModalOpen) {
        setIsDistributionProofModalOpen(false);
        setIsOpenProofModal(false);
      }
      if (isModalLargeImageOpen) {
        setIsModalLargeImageOpen(false);
      }
    },
  });

  if (!isOpen || !detailDonation) return null;
  return (
    <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center p-2">
      <div
        ref={detailModalRef}
        className="bg-white rounded-lg p-4 md:p-8 space-y-6 text-black max-h-[90vh] overflow-y-auto mx-auto"
      >
        {isFetchDetailDonationLoading ? (
          <div className="flex items-center justify-center w-60 h-60">
            <ClipLoader
              color="#543A14"
              loading={isFetchDetailDonationLoading}
              size={50}
            />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="font-bold text-lg sm:text-xl">
                Detail Riwayat Barang Donasi{" "}
                <span>{`(${detailDonation?.id})`}</span>
              </h1>
              <span
                className={`${statusColor} text-white px-4 py-1.5 font-bold rounded-full text-sm w-full sm:w-auto text-center`}
              >
                {statusList.find((status) => status.value === latestStatus)
                  ?.label || latestStatus}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
              {/* Left Section */}
              <div className="space-y-6 flex flex-col items-center">
                <div className="w-80 space-y-4">
                  {/* Large Image */}
                  <div
                    className="bg-[#C2C2C2] aspect-square rounded-lg relative"
                    onClick={() => setIsModalLargeImageOpen(true)}
                  >
                    {imgSrc && (
                      <Image
                        src={imgSrc}
                        alt="Donation item image large"
                        fill
                        className="object-cover rounded-lg"
                      />
                    )}
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {detailDonation?.attachments?.files?.map((file, index) => {
                      return (
                        <div
                          key={index}
                          className="bg-[#C2C2C2] rounded-lg w-16 aspect-square relative"
                        >
                          <AttachmentImage
                            index={index}
                            fileName={file.name}
                            onSelect={(src) => setImgSrc(src)}
                            onLoad={handleImageLoaded}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Large Image Modal */}
                {isModalLargeImageOpen && (
                  <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
                    <div
                      ref={largeImageModalRef}
                      className="bg-white rounded-lg p-4 md:p-8 space-y-6 text-black max-h-[90vh] overflow-y-auto w-full max-w-screen-sm mx-auto"
                    >
                      <div className="space-y-4">
                        {/* Large Image */}
                        <div className="bg-[#C2C2C2] aspect-square rounded-lg relative">
                          {imgSrc && (
                            <Image
                              src={imgSrc}
                              alt="Donation item image large"
                              fill
                              className="object-cover rounded-lg"
                            />
                          )}
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                          {detailDonation?.attachments?.files?.map(
                            (file, index) => {
                              return (
                                <div
                                  key={index}
                                  className="bg-[#C2C2C2] rounded-lg w-16 aspect-square relative"
                                >
                                  <AttachmentImage
                                    index={index}
                                    fileName={file.name}
                                    onSelect={(src) => setImgSrc(src)}
                                    onLoad={handleImageLoaded}
                                  />
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 w-full">
                  {userRole !== "admin" && (
                    <ButtonCustom
                      variant="outlineOrange"
                      type="button"
                      label="Hubungi Tempat Penampung"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        const urlWhatsapp = `https://wa.me/${detailDonation.collectionCenter?.phoneNumber}?text=Halo, saya ingin menanyakan tentang donasi saya dengan ID barang donasi: ${detailDonation.id}.`;
                        window.open(urlWhatsapp, "_blank");
                      }}
                    />
                  )}

                  {(() => {
                    if (latestStatus === "DIGITAL_CHECKING") return null;

                    const showButton = () => {
                      if (userRole === "admin") {
                        return latestStatus === "CONFIRMING";
                      } else {
                        return ["PENDING", "CONFIRMED"].includes(latestStatus);
                      }
                    };

                    const buttonLabel = (() => {
                      if (userRole === "admin") {
                        return shelterShippingDate
                          ? "Pilih Ulang Tanggal Pengiriman"
                          : "Pilih Tanggal Pengiriman";
                      } else {
                        return shelterShippingDate
                          ? "Atur ulang opsi tanggal"
                          : "Atur opsi tanggal pengiriman";
                      }
                    })();

                    return (
                      showButton() && (
                        <ButtonCustom
                          variant="orange"
                          type="button"
                          label={buttonLabel}
                          className="w-full"
                          onClick={() => setIsShippingDateModalOpen(true)}
                        />
                      )
                    );
                  })()}

                  {latestStatus === "DISTRIBUTED" && (
                    <ButtonCustom
                      variant="orange"
                      type="button"
                      label="Lihat Bukti Penyaluran"
                      className="w-full"
                      onClick={() => {
                        setIsDistributionProofModalOpen(true);
                        setIsOpenProofModal(true);
                      }}
                    />
                  )}

                  {userRole === "admin" &&
                    ![
                      "PENDING",
                      "CONFIRMING",
                      "CONFIRMED",
                      "DISTRIBUTED",
                      "REJECTED",
                    ].includes(latestStatus) && (
                      <ButtonCustom
                        variant="brown"
                        type="button"
                        label="Ubah Status"
                        className="w-full"
                        onClick={() => setIsUpdateStatusModalOpen(true)}
                      />
                    )}
                </div>
              </div>

              {/* Right Section */}
              <div className="space-y-4 max-w-[450px]">
                {rejectedRedirectedNote && (
                  <ListTextWithTitle
                    title="Alasan Penolakan:"
                    values={[rejectedRedirectedNote]}
                    className="text-red-600"
                  />
                )}

                <ListTextWithTitle
                  title="Tanggal Donasi:"
                  values={[
                    <FormattedWIBDate
                      key="donation-date"
                      date={detailDonation?.createdAt}
                      type="time"
                    />,
                  ]}
                />

                <ListTextWithTitle
                  title="Informasi Donatur:"
                  values={[
                    `${detailDonation.user.firstName} ${detailDonation.user.lastName}`,
                    detailDonation.user.phoneNumber,
                    `${detailDonation.address?.reference && detailDonation.address?.reference !== "null" ? `(${detailDonation.address?.reference}) ` : ""}${detailDonation.address.detail}`,
                  ]}
                />

                <ListTextWithTitle
                  title="Barang Donasi:"
                  values={[
                    `${donationTypes.find((type) => type.value === detailDonation.donationType)?.label || detailDonation.donationType} (${detailDonation.quantity}pcs, ${detailDonation.weight}kg)`,
                  ]}
                />

                <ListTextWithTitle
                  title="Detail Tempat Penampung:"
                  values={[
                    detailDonation.collectionCenter.name,
                    detailDonation.post?.name,
                    `${detailDonation.targetAddress?.reference && !detailDonation.targetAddress?.reference !== "null" ? `(${detailDonation.targetAddress.reference}) ` : ""} ${detailDonation.targetAddress.detail}`,
                    <TextBetween
                      key="event"
                      label="Event"
                      value={detailDonation.event?.name || "-"}
                    />,
                  ]}
                />

                <ListTextWithTitle
                  title="Alasan Pengaturan Tanggal Ulang:"
                  values={[rescheduleNotes || "-"]}
                />

                <ListTextWithTitle
                  title="Informasi Pengiriman:"
                  values={[
                    shippingTypes.find(
                      (type) => type.value === detailDonation.pickupType
                    )?.label || detailDonation.pickupType,
                    <TextBetween
                      key="tanggal-pengajuan"
                      label="Tanggal Pengajuan"
                      value={
                        donorShippingDate.length > 0 &&
                        latestStatus === "CONFIRMING" ? (
                          donorShippingDate.map((date, index) => (
                            <span key={index}>
                              <FormattedWIBDate date={date} type="time" />
                            </span>
                          ))
                        ) : (
                          <span className="font-bold text-[#F0BB78] text-start sm:text-end text-nowrap">
                            {latestStatus === "DIGITAL_CHECKING"
                              ? "Proses pemeriksaan digital"
                              : latestStatus === "PENDING"
                                ? "Donatur belum mengirim opsi"
                                : "-"}
                          </span>
                        )
                      }
                      className="border-b border-[#C2C2C2] pb-1"
                    />,
                    <TextBetween
                      key="tanggal-konfirmasi"
                      label="Tanggal Konfirmasi Tempat Penampung"
                      value={
                        <span
                          className={`font-bold ${
                            shelterShippingDate
                              ? "text-black"
                              : "text-[#F0BB78]"
                          } text-end`}
                        >
                          {latestStatus === "DIGITAL_CHECKING" ? (
                            "Proses pemeriksaan digital"
                          ) : latestStatus === "PENDING" ? (
                            "Donatur belum mengirim opsi"
                          ) : latestStatus === "CONFIRMING" ? (
                            "Tempat penampung belum memilih"
                          ) : (
                            <FormattedWIBDate
                              date={shelterShippingDate}
                              type="time"
                            />
                          )}
                        </span>
                      }
                      textClassName="justify-start sm:justify-end text-start sm:text-end w-full"
                    />,
                  ]}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Bukti Penyaluran */}
      {isDistributionProofModalOpen && (
        <div className="bg-black/40 w-screen h-screen fixed z-50 inset-0 flex items-center justify-center">
          <div
            ref={distributionProofModalRef}
            className="bg-white rounded-lg p-8 space-y-6 text-black max-w-[640px]"
          >
            <div className="space-y-5">
              <div className="space-y-3">
                <h1 className="font-bold text-xl">Laporan Bukti Penyaluran</h1>
                <p>
                  Berikut adalah bukti penyaluran dalam bentuk foto dan laporan
                  terkait penyaluran barang donasi yang telah dilakukan oleh
                  tempat penampung ke pihak yang membutuhkan.
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg relative w-full aspect-[5/3] overflow-hidden">
                  {detailDonation?.proofs?.files[0] ? (
                    <Image
                      src={detailDonation?.proofs?.files[0]?.path}
                      alt={detailDonation?.proofs?.files[0]?.name}
                      fill
                      className="object-contain object-center rounded-lg"
                    />
                  ) : null}
                </div>
                <span className="font-bold text-lg">Laporan Singkat:</span>
                <p>
                  {
                    detailDonation?.approvals?.approvalDetails?.find(
                      (item) => item.status === "DISTRIBUTED"
                    )?.notes
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalDetailDonation;
