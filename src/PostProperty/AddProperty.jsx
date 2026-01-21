import React, { useState } from "react";

const AddProperty = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    price: "",
    location: "",
    description: "",
    image: null,
    contact: "",
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Validation
  const validateForm = () => {
    let newErrors = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.type) newErrors.type = "Property type is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Enter valid price";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.contact || formData.contact.length < 10)
      newErrors.contact = "Enter valid contact number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // NEXT → Preview
  const handleNext = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStep(2);
  };

  // FINAL SUBMIT
  const handleFinalSubmit = () => {
    console.log("Submitted Property:", formData);
    alert("Property submitted successfully (Frontend only)");
  };

  // EDIT
  const handleEdit = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl">

        {/* ================= FORM STEP ================= */}
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold mb-8 text-center">
              Sell Your Property
            </h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="md:col-span-2">
                <input
                  type="text"
                  name="title"
                  placeholder="Property Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              >
                <option value="">Select Property Type</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Plot">Plot</option>
              </select>
              {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}

              <input
                type="number"
                name="price"
                placeholder="Price (PKR)"
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

              <input
                type="text"
                name="contact"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />
              {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}

              <div className="md:col-span-2">
                <textarea
                  name="description"
                  placeholder="Property Description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  onClick={handleNext}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
                >
                  Next
                </button>
              </div>
            </form>
          </>
        )}

        {/* ================= PREVIEW STEP ================= */}
{step === 2 && (
  <>
    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
      Preview Property
    </h2>

    <div className="border rounded-xl p-6 bg-gray-50 space-y-6">

      {/* Image Section */}
      {imagePreview && (
        <div className="w-full">
          <img
            src={imagePreview}
            alt="Property Preview"
            className="w-full h-64 object-cover rounded-lg shadow"
          />
        </div>
      )}

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="border rounded-lg p-4 bg-white">
          <p className="text-sm text-gray-500">Property Title</p>
          <p className="font-semibold text-lg">{formData.title}</p>
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <p className="text-sm text-gray-500">Property Type</p>
          <p className="font-semibold text-lg">{formData.type}</p>
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <p className="text-sm text-gray-500">Price</p>
          <p className="font-semibold text-lg text-green-600">
            PKR {formData.price}
          </p>
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <p className="text-sm text-gray-500">Location</p>
          <p className="font-semibold text-lg">{formData.location}</p>
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <p className="text-sm text-gray-500">Contact</p>
          <p className="font-semibold text-lg">{formData.contact}</p>
        </div>

      </div>

      {/* Description */}
      <div className="border rounded-lg p-4 bg-white">
        <p className="text-sm text-gray-500 mb-1">Description</p>
        <p className="text-gray-700 leading-relaxed">
          {formData.description || "No description provided"}
        </p>
      </div>

    </div>

    {/* Buttons */}
    <div className="flex gap-4 mt-8">
      <button
        onClick={handleEdit}
        className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition"
      >
        Edit
      </button>

      <button
        onClick={handleFinalSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
      >
        Submit Property
      </button>
    </div>
  </>
)}
      </div>
    </div>
  );
}
export default AddProperty;