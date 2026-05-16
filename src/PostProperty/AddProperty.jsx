import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  Home,
  Building2,
  MapPin,
  BedDouble,
  Bath,
  ImagePlus,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";

const faisalabadLocations = [
  "Lyallpur Town", "Madina Town", "Jinnah Town", "Iqbal Town", "Chak Jhumra Town",
  "Jaranwala Town", "Samundri Town", "Tandlianwala Town", "Faisalabad City",
  "Faisalabad Sadar", "Chak Jhumra", "Jaranwala", "Samundri", "Tandlianwala",
  "D Ground", "People Colony No 1", "People Colony No 2", "Canal Road",
  "Susan Road", "Wapda City", "FDA City", "Citi Housing", "Gulberg",
  "Samanabad", "Millat Town", "Satiana Road", "Jaranwala Road", "Samundari Road",
  "Jhang Road", "Sargodha Road", "Sheikhupura Road", "Eden Gardens",
  "Eden Valley", "Kohinoor City", "Batala Colony", "Civil Lines", "Officers Colony",
  "Ghulam Muhammad Abad", "D-Type Colony", "Nishatabad", "Gulistan Colony",
  "Manawala", "Khurrianwala", "Dijkot", "Mamu Kanjan", "Satiana", "Makuana",
  "Sadhar", "Garh Fateh Shah", "Rodala Road", "Lundianwala", "Bachiana",
  "Kanjwani", "Salatwala", "Pansra", "Thikriwala", "Dhandra", "Katchery Bazaar",
  "Chiniot Bazaar", "Aminpur Bazaar", "Bhawana Bazaar", "Jhang Bazaar",
  "Montgomery Bazaar", "Karkhana Bazaar", "Rail Bazaar"
].sort((a, b) => a.localeCompare(b));

const PreviewCard = ({ title, value }) => {
  return (
    <div className="bg-gray-50 border rounded-3xl p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-lg font-semibold text-gray-800 mt-1">
        {value || "-"}
      </h3>
    </div>
  );
};

const AddProperty = () => {
  const [customArea, setCustomArea] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    purpose: "",
    propertyType: "",
    cityId: 1,
    location: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    address: "",
    images: [],
  });

  const propertySizes = [
    "3 Marla",
    "5 Marla",
    "7 Marla",
    "8 Marla",
    "10 Marla",
    "12 Marla",
    "1 Kanal",
    "2 Kanal",
    "4 Kanal",
    "8 Kanal",
    "1 Acre",
    "2 Acre",
    "5 Acre",
    "Other"
  ];

  const [locationQuery, setLocationQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const handleLocationSelect = (loc) => {
    const cleanLoc = loc.trim();

    setFormData((prev) => ({
      ...prev,
      location: cleanLoc,
    }));

    setLocationQuery(cleanLoc);
    setShowDropdown(false);

    setErrors((prev) => ({
      ...prev,
      location: "",
    }));
  };
  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // IMAGE HANDLER
  // =========================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 6);

    setFormData((prev) => ({
      ...prev,
      images: files,
    }));

    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // =========================
  // VALIDATION
  // =========================
  const validateForm = () => {
    let err = {};

    if (!formData.title.trim()) err.title = "Title is required";
    if (!formData.price || formData.price <= 0)
      err.price = "Valid price required";

    if (!formData.purpose) err.purpose = "Select purpose";
    if (!formData.propertyType)
      err.propertyType = "Select property type";

    if (!formData.location) err.location = "Select location";
    if (!formData.area.trim()) err.area = "Area required";

    if (!formData.bedrooms || formData.bedrooms <= 0)
      err.bedrooms = "Bedrooms required";
    if (!formData.bathrooms || formData.bathrooms <= 0)
      err.bathrooms = "Bathrooms required";

    if (!formData.address.trim()) err.address = "Address required";

    if (formData.images.length === 0)
      err.images = "At least 1 image required";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  // =========================
  // NEXT STEP
  // =========================
  const handleNext = () => {
    if (validateForm()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      console.log("📤 Sending Location:", JSON.stringify(formData.location)); // ← Debug

      const payload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        price: Number(formData.price),
        purpose: formData.purpose.toUpperCase(),
        propertyType: formData.propertyType.toUpperCase(),
        city: { id: Number(formData.cityId) },
        location: formData.location,           // ← Make sure no extra spaces
        area: formData.area.trim(),
        bedrooms: (formData.bedrooms).trim(),
        bathrooms: (formData.bathrooms).trim(),
        address: formData.address.trim(),
      };

      console.log("Full Payload:", payload);   // ← Debug

      const data = new FormData();
      data.append("property", new Blob([JSON.stringify(payload)], { type: "application/json" }));

      formData.images.forEach(img => data.append("images", img));
      console.log("FINAL LOCATION BEFORE SEND:", formData.location); // ← Final Debug

      await axios.post("http://localhost:8080/api/properties/create", data);

      alert("✅ Property Added Successfully!");
      // reset form...

    } catch (error) {
      console.error("❌ Full Error:", error.response?.data);
      alert(error.response?.data?.message || error.response?.data || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STATS CARD
  // =========================
  const stats = useMemo(() => {
    return [
      {
        label: "Purpose",
        value: formData.purpose || "-",
      },
      {
        label: "Type",
        value: formData.propertyType || "-",
      },
      {
        label: "Location",
        value: formData.location || "-",
      },
    ];
  }, [formData]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-6 border">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Property Management
              </h1>
              <p className="text-gray-500 mt-1">
                ERP Level Property Insertion Dashboard
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                ${step >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                  }`}
              >
                1
              </div>

              <div className="w-16 h-1 bg-gray-200 rounded">
                <div
                  className={`h-1 rounded bg-blue-600 transition-all duration-300
                  ${step === 2 ? "w-full" : "w-0"}`}
                />
              </div>

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                ${step >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                  }`}
              >
                2
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border h-fit">
            <h2 className="font-bold text-lg mb-5">
              Property Overview
            </h2>

            <div className="space-y-4">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-4 border"
                >
                  <p className="text-sm text-gray-500">
                    {item.label}
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FORM AREA */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border p-6">
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Property Details
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Fill complete property information carefully
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* TITLE */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Property Title
                    </label>
                    <div className="relative mt-2">
                      <Home
                        size={18}
                        className="absolute left-4 top-4 text-gray-400"
                      />
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Luxury House in D Ground"
                        className="w-full border rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* PRICE */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="25000000"
                      className="w-full border rounded-2xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* PURPOSE */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Purpose
                    </label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className="w-full border rounded-2xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Purpose</option>
                      <option value="SALE">SALE</option>
                      <option value="RENT">RENT</option>
                    </select>
                    {errors.purpose && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.purpose}
                      </p>
                    )}
                  </div>

                  {/* TYPE */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full border rounded-2xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      <option value="HOUSE">HOUSE</option>
                      <option value="FLAT">FLAT</option>
                      <option value="PLOT">PLOT</option>
                    </select>
                    {errors.propertyType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.propertyType}
                      </p>
                    )}
                  </div>

                  {/* LOCATION */}
                  {/* Location Field - Most Important Fix */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>

                    <div className="relative mt-2">
                      <MapPin size={18} className="absolute left-4 top-4 text-gray-400" />

                      <input
                        type="text"
                        name="location"
                        value={formData.location}   // ONLY THIS
                        placeholder="Search location..."
                        onChange={(e) => {
                          const value = e.target.value;

                          setFormData((prev) => ({
                            ...prev,
                            location: value,
                          }));

                          setLocationQuery(value);
                          setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        className="w-full border rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {showDropdown && (
                        <div className="absolute z-50 bg-white border w-full mt-2 rounded-2xl max-h-60 overflow-y-auto shadow-lg">
                          {faisalabadLocations
                            .filter((loc) =>
                              loc.toLowerCase().includes((formData.location || "").toLowerCase())
                            )
                            .map((loc) => (
                              <div
                                key={loc}
                                onClick={() => {
                                  const clean = loc.trim();

                                  setFormData((prev) => ({
                                    ...prev,
                                    location: clean,
                                  }));

                                  setLocationQuery(clean);
                                  setShowDropdown(false);
                                }}
                                className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                              >
                                {loc}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                    )}
                  </div>

                  {/* AREA - Using propertySizes (added missing select as it's in your logic) */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Area / Size
                    </label>
                    <select
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className="w-full border rounded-2xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Area</option>
                      {propertySizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.area === "Other" && (
                    <input
                      type="text"
                      placeholder="Enter Custom Size (e.g. 15 Marla)"
                      value={customArea}
                      onChange={(e) => {
                        setCustomArea(e.target.value);
                        setFormData({
                          ...formData,
                          area: e.target.value,
                        });
                      }}
                      className="w-full border rounded-2xl px-4 py-3 mt-3"
                    />
                  )}

                  {errors.area && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.area}
                    </p>
                  )}
                </div>

                {/* BEDROOMS */}
                <div className="mt-5">
                  <label className="text-sm font-medium text-gray-700">
                    Bedrooms
                  </label>
                  <div className="relative mt-2">
                    <BedDouble
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      placeholder="5"
                      className="w-full border rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.bedrooms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bedrooms}
                    </p>
                  )}
                </div>

                {/* BATHROOMS */}
                <div className="mt-5">
                  <label className="text-sm font-medium text-gray-700">
                    Bathrooms
                  </label>
                  <div className="relative mt-2">
                    <Bath
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      placeholder="4"
                      className="w-full border rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.bathrooms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bathrooms}
                    </p>
                  )}
                </div>

                {/* ADDRESS */}
                <div className="mt-5">
                  <label className="text-sm font-medium text-gray-700">
                    Full Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House 25, Canal Road Faisalabad"
                    className="w-full border rounded-2xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div className="mt-5">
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write complete property description..."
                    className="w-full border rounded-2xl px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* IMAGE */}
                <div className="mt-5">
                  <label className="text-sm font-medium text-gray-700">
                    Property Images
                  </label>
                  <label className="border-2 border-dashed rounded-3xl p-10 mt-2 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                    <ImagePlus className="text-gray-500 mb-3" size={38} />
                    <p className="font-medium text-gray-700">
                      Upload Property Images
                    </p>
                    <span className="text-sm text-gray-500 mt-1">
                      Maximum 6 images allowed
                    </span>
                    <input
                      type="file"
                      multiple
                      hidden
                      onChange={handleImageChange}
                    />
                  </label>
                  {errors.images && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.images}
                    </p>
                  )}
                </div>

                {/* PREVIEW IMAGES */}
                {imagePreviews.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt=""
                        className="h-40 w-full object-cover rounded-2xl"
                      />
                    ))}
                  </div>
                )}

                {/* NEXT BUTTON */}
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition"
                  >
                    Continue Preview
                    <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2
                    className="text-green-600"
                    size={32}
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Final Preview
                    </h2>
                    <p className="text-gray-500">
                      Verify property before publishing
                    </p>
                  </div>
                </div>

                {/* IMAGES */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {imagePreviews.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className="rounded-3xl h-60 w-full object-cover"
                    />
                  ))}
                </div>

                {/* DETAILS */}
                <div className="grid md:grid-cols-2 gap-5">
                  <PreviewCard title="Title" value={formData.title} />
                  <PreviewCard title="Price" value={`PKR ${formData.price}`} />
                  <PreviewCard title="Purpose" value={formData.purpose} />
                  <PreviewCard title="Property Type" value={formData.propertyType} />
                  <PreviewCard title="Location" value={formData.location} />
                  <PreviewCard title="Area" value={formData.area} />
                  <PreviewCard title="Bedrooms" value={formData.bedrooms} />
                  <PreviewCard title="Bathrooms" value={formData.bathrooms} />
                </div>

                <div className="mt-5 bg-gray-50 rounded-3xl p-5 border">
                  <h3 className="font-bold text-lg mb-2">Description</h3>
                  <p className="text-gray-600 leading-7">
                    {formData.description}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col md:flex-row gap-4 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-2xl flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    Edit Property
                  </button>

                  <button
                    disabled={loading}
                    onClick={handleSubmit}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Building2 size={18} />
                        Publish Property
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;