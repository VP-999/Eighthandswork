"use client"

import { useState } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const { supabase } = useSupabase()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("contact_messages").insert([formData])

      if (error) throw error

      setSubmitStatus({
        type: "success",
        message: "Your message has been sent successfully! We will get back to you soon.",
      })

      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus({
        type: "error",
        message: "There was an error sending your message. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)

      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="section-title">Contact Us</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Have questions about our products or services? Get in touch with us and we'll be happy to assist you.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
            <p className="text-gray-600 mb-8">Fill out the form and our team will get back to you within 24 hours.</p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-amber-500 mt-1" />
                <div>
                  <h4 className="font-bold">Our Location</h4>
                  <p className="text-gray-600">1000 sq ft workshop, Narayanganj, Bangladesh</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-amber-500 mt-1" />
                <div>
                  <h4 className="font-bold">Phone Number</h4>
                  <p className="text-gray-600">+880 1234-567890</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-amber-500 mt-1" />
                <div>
                  <h4 className="font-bold">Email Address</h4>
                  <p className="text-gray-600">info@eighthandswork.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="input-field"
                ></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {submitStatus && (
                <div
                  className={`mt-4 p-3 rounded-md ${
                    submitStatus.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
