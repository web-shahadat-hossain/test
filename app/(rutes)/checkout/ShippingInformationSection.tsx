"use client";
import { useEffect, useState } from "react";
import { Input } from "@headlessui/react";
import { Text } from "../cart/UI/Text";
import { Heading } from "../cart/UI/Heading";

// ----------------------
// Types
// ----------------------

type FormDataType = {
  contactNo: string;
  email: string;
  address: string;
};

type ShippingInformationSectionProps = {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
};

type Division = {
  id: number;
  name: string;
};

type District = {
  id: number;
  name: string;
};

type AccountData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

type Address = {
  district: string;
  city: string;
  street: string;
  building: string;
};

// ----------------------
// Component
// ----------------------

export default function ShippingInformationSection({ setFormData }: any) {
  const [accountData, setAccountData] = useState<AccountData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [newAddress, setNewAddress] = useState<Address>({
    district: "",
    city: "",
    street: "",
    building: "",
  });

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  // Fetch divisions on mount
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const res = await fetch("https://bdapi.vercel.app/api/v.1/division");
        const data = await res.json();
        setDivisions(data.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.error("Failed to load divisions");
      }
    };

    fetchDivisions();
  }, []);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setAccountData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
        });

        setFormData((prev: any) => ({
          ...prev,
          contactNo: prev.contactNo || data.phone || "",
          email: prev.email || data.email || "",
        }));
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, [setFormData]);

  // Fetch districts when division changes
  const fetchDistricts = async (divisionId: string) => {
    try {
      const res = await fetch(
        `https://bdapi.vercel.app/api/v.1/district/${divisionId}`
      );
      const data = await res.json();
      setDistricts(data.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error("Failed to load districts");
    }
  };

  // Update full address when any part of it changes
  useEffect(() => {
    const fullAddress = `${newAddress.district} ${newAddress.city} ${newAddress.street} ${newAddress.building}`;
    setFormData((prev: any) => ({
      ...prev,
      address: fullAddress.trim(),
    }));
  }, [newAddress, setFormData]);

  return (
    <div className="flex w-full flex-col gap-8 rounded-[10px] bg-white px-[30px] py-[38px] shadow-xs">
      <div className="flex flex-col items-start gap-5">
        <Heading as="h1" className="text-[30px] font-medium">
          Shipping Information
        </Heading>

        <div className="flex flex-col gap-2.5 w-full">
          <div className="flex w-full flex-col gap-2.5">
            <Input
              type="text"
              name="firstName"
              readOnly
              defaultValue={accountData.first_name}
              placeholder="First Name"
              className="rounded-lg bg-[#F5F5F5] border border-[#f1f5f9] px-3.5 py-2"
            />
            <Input
              type="text"
              defaultValue={accountData.last_name}
              name="lastName"
              readOnly
              placeholder="Last Name"
              className="rounded-lg bg-[#F5F5F5] border border-[#f1f5f9] px-3.5 py-2"
            />
          </div>

          <div className="flex w-full md:flex-col flex-col-reverse gap-2.5">
            <Input
              name="phone"
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  contactNo: e.target.value,
                }))
              }
              placeholder="Contact No."
              defaultValue={accountData.phone}
              className="rounded-lg bg-[#F5F5F5] border border-[#f1f5f9] px-3.5 py-2"
            />
            <Input
              type="email"
              name="email"
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, email: e.target.value }))
              }
              defaultValue={accountData.email}
              placeholder="Email Address"
              className="rounded-lg bg-[#F5F5F5] border border-[#f1f5f9] px-3.5 py-2"
            />
          </div>
        </div>
      </div>

      <div className="mb-2 flex flex-col items-start gap-[18px]">
        <Text as="p" className="text-[20px] font-medium">
          Address
        </Text>
        <div className="flex gap-2.5 w-full">
          <div className="flex w-full flex-col gap-2.5">
            <select
              value={
                divisions
                  .find((div) => div.name === newAddress.district)
                  ?.id.toString() || ""
              }
              onChange={async (e) => {
                const selectedId = e.target.value;
                const selectedDivision = divisions.find(
                  (div) => div.id.toString() === selectedId
                );

                if (selectedDivision) {
                  setNewAddress((prev: any) => ({
                    ...prev,
                    district: selectedDivision.name,
                    city: "",
                  }));
                  await fetchDistricts(selectedId);
                }
              }}
              required
              className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="">Select Division</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>

            <Input
              name="street"
              onChange={(e) =>
                setNewAddress((prev: any) => ({
                  ...prev,
                  street: e.target.value,
                }))
              }
              placeholder="Road / Street"
              className="rounded-lg bg-[#F5F5F5] border border-[#f1f5f9] px-3.5 py-2"
            />
          </div>

          <div className="flex w-full flex-col gap-2.5">
            <select
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress((prev: any) => ({
                  ...prev,
                  city: e.target.value,
                }))
              }
              required
              className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-[#F5F5F5]"
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>

            <Input
              name="house"
              onChange={(e) =>
                setNewAddress((prev: any) => ({
                  ...prev,
                  building: e.target.value,
                }))
              }
              placeholder="House / Flat No."
              className="rounded-lg bg-[#F5F5F5] border border-[#f1f5f9] px-3.5 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
