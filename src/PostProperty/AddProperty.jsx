import React, { useState } from "react";
import axios from "axios";

const AddProperty = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    purpose: "",
    propertyType: "",
    city: "",
    area: "",
    address: "",
    images: [], // store multiple images
  });

  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Handle image selection (max 4)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4); // max 4
    setFormData({ ...formData, images: files });

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Simple validation
  const validateForm = () => {
    let err = {};
    if (!formData.title) err.title = "Title required";
    if (!formData.price || formData.price <= 0) err.price = "Valid price required";
    if (!formData.purpose) err.purpose = "Purpose required";
    if (!formData.propertyType) err.propertyType = "Property type required";
    if (!formData.city) err.city = "City required";
    if (!formData.area) err.area = "Area required";
    if (!formData.address) err.address = "Address required";
    if (formData.images.length === 0) err.images = "At least one image required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Move to step 2
  const handleNext = (e) => {
    e.preventDefault();
    if (validateForm()) setStep(2);
  };

  // Submit data to backend
const handleSubmit = async () => {
  if (loading) return; // prevent multiple clicks
  setLoading(true);

  try {
    const data = new FormData();
    data.append(
      "property",
      new Blob([JSON.stringify({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        purpose: formData.purpose,
        propertyType: formData.propertyType,
        city: formData.city,
        area: formData.area,
        address: formData.address,
      })], { type: "application/json" })
    );
    formData.images.forEach(img => data.append("images", img));

    await axios.post("http://localhost:8080/api/properties/create", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Property submitted successfully!");
    setFormData({
      title: "", description: "", price: "", purpose: "",
      propertyType: "", city: "", area: "", address: "", images: []
    });
    setImagePreviews([]);
    setStep(1);

  } catch (err) {
    console.error("Error uploading property:", err);
    alert("Property submission failed.");
  } finally {
    setLoading(false); // enable button again
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-5xl p-10 rounded-3xl shadow-2xl">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-4xl font-bold text-center mb-10">🏠 Add New Property</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="md:col-span-2">
                <label className="font-semibold">Property Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3"
                  placeholder="Luxury House in DHA"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>

              <div>
                <label className="font-semibold">Purpose</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3"
                >
                  <option value="">Select</option>
                  <option value="SALE">Sale</option>
                  <option value="RENT">Rent</option>
                </select>
                {errors.purpose && <p className="text-red-500 text-sm">{errors.purpose}</p>}
              </div>

              <div>
                <label className="font-semibold">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3"
                >
                  <option value="">Select</option>
                  <option value="HOUSE">House</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="PLOT">Plot</option>
                </select>
                {errors.propertyType && <p className="text-red-500 text-sm">{errors.propertyType}</p>}
              </div>

              <div>
                <label className="font-semibold">Price (PKR)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
              </div>

              <div>
                <label className="font-semibold">City</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3"
                />
                {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
              </div>

              <div>
                <label className="font-semibold">Area</label>
                <input
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3"
                />
                {errors.area && <p className="text-red-500 text-sm">{errors.area}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold">Full Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3"
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full mt-2 border rounded-xl p-3"
                />
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label className="font-semibold">Property Images (max 4)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full mt-2"
                />
                {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
                <div className="flex gap-2 mt-2">
                  {imagePreviews.map((src, idx) => (
                    <img key={idx} src={src} alt="preview" className="w-20 h-20 object-cover rounded-xl" />
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg"
                >
                  Preview Property →
                </button>
              </div>
            </form>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-4xl font-bold text-center mb-8">👀 Property Preview</h2>

            {imagePreviews.length > 0 && (
              <div className="flex gap-2 mb-6">
                {imagePreviews.map((src, idx) => (
                  <img key={idx} src={src} alt="preview" className="w-32 h-32 object-cover rounded-xl" />
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
              <p><b>Title:</b> {formData.title}</p>
              <p><b>Purpose:</b> {formData.purpose}</p>
              <p><b>Type:</b> {formData.propertyType}</p>
              <p className="text-green-600"><b>Price:</b> PKR {formData.price}</p>
              <p><b>City:</b> {formData.city}</p>
              <p><b>Area:</b> {formData.area}</p>
              <p className="md:col-span-2"><b>Address:</b> {formData.address}</p>
            </div>

            <p className="mt-6 text-gray-700">{formData.description}</p>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setStep(1)}
                className="w-full bg-gray-700 text-white py-4 rounded-xl font-bold"
              >
                Edit
              </button>
              <button
  type="button"                 // make sure it is NOT "submit" to prevent form default submit
  onClick={handleSubmit}
  disabled={loading}             // prevent double clicks
  className={`w-full py-4 rounded-xl font-bold 
              ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} 
              text-white`}
>
  {loading ? "Saving..." : "Submit Property"}
</button>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddProperty;
