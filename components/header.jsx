"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, ShoppingCart, User, Settings, ChevronDown, Search } from "lucide-react"
import { useSupabase } from "@/lib/supabase-provider"
import { useCart } from "@/lib/cart-context"
import MegaMenu from "./mega-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const { supabase } = useSupabase()
  const { cartItems } = useCart()
  const accountMenuRef = useRef(null)
  const megaMenuRef = useRef(null)
  const megaMenuTriggerRef = useRef(null)
  const searchInputRef = useRef(null)
  const router = useRouter()

  // Category groups for mobile menu
  const categoryGroups = {
    "Living Room": "/products?category=Living%20Room%20Set",
    Dining: "/products?category=Dining%20Table",
    Bedroom: "/products?category=Bedroom%20Set",
    Office: "/products?category=Office%20Desk",
<<<<<<< HEAD
    Restaurant: "/products?category=Restaurant%20Set",
    Industrial: "/products?category=Industrial%20Solutions",
=======
    "New Arrivals": "/products?category=new-arrivals",
    "Epoxy Items": "/products?category=epoxy",
>>>>>>> friend/main
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        setUser(session?.user || null)

        if (session?.user) {
          // Check if user is admin
          const { data, error } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

          if (!error && data) {
            setIsAdmin(data.is_admin)
          }
        }
      } catch (error) {
        console.error("Error getting user:", error)
      }
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)

      if (session?.user) {
        // Check if user is admin
        const { data, error } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

        if (!error && data) {
          setIsAdmin(data.is_admin)
        }
      } else {
        setIsAdmin(false)
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false)
      }

      // Close mega menu when clicking outside, but not when clicking the trigger
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(event.target) &&
        megaMenuTriggerRef.current &&
        !megaMenuTriggerRef.current.contains(event.target)
      ) {
        setIsMegaMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close mega menu when route changes
  useEffect(() => {
    setIsMegaMenuOpen(false)
    setIsMenuOpen(false)
  }, [pathname])

  // Focus search input when search box opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen)
  }

  const toggleMegaMenu = () => {
    setIsMegaMenuOpen(!isMegaMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

<<<<<<< HEAD
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/70 backdrop-blur-md"
      } rounded-full mx-4 mt-4 max-w-[calc(100%-2rem)] py-3`}
    >
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Eight Hands Work" width={150} height={60} className="h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className={`text-lg font-medium hover:text-amber-500 transition-colors ${pathname === "/" ? "text-amber-500" : ""}`}
          >
            Home
          </Link>

          {/* Products dropdown trigger */}
          <div className="relative" ref={megaMenuTriggerRef}>
            <button
              onClick={toggleMegaMenu}
              className={`flex items-center text-lg font-medium hover:text-amber-500 transition-colors ${
                pathname.startsWith("/products") ? "text-amber-500" : ""
              }`}
            >
              Products
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isMegaMenuOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {navLinks.slice(1).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-lg font-medium hover:text-amber-500 transition-colors ${pathname === link.href ? "text-amber-500" : ""}`}
            >
              {link.name}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              className={`text-lg font-medium text-amber-500 hover:text-amber-600 transition-colors flex items-center`}
            >
              <Settings className="h-5 w-5 mr-1" />
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {/* Search Icon */}
          <button onClick={toggleSearch} className="relative">
            <Search className="h-6 w-6" />
          </button>

          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={accountMenuRef}>
              <button onClick={toggleAccountMenu} className="flex items-center space-x-1">
                <User className="h-6 w-6" />
                <span className="text-sm font-medium">Account</span>
              </button>
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm font-medium text-amber-500 hover:bg-amber-50"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut()
                      setIsAccountMenuOpen(false)
                      router.push("/")
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="flex items-center space-x-1">
              <User className="h-6 w-6" />
              <span className="text-sm font-medium">Login</span>
            </Link>
          )}
        </div>

        <button className="md:hidden" onClick={toggleMenu}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-24">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 overflow-hidden">
=======
  // New navigation links as requested
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products", hasDropdown: true },
    { name: "Rooms", href: "/rooms" },
    { name: "New Arrival", href: "/products?category=new-arrivals" },
    { name: "Interior", href: "/interior" },
    { name: "Epoxy Services", href: "/epoxy-services" },
    { name: "Resellers", href: "/resellers" },
  ]

  return (
    <div className="fixed w-full z-50 flex justify-center mt-3 px-4">
      <header
        className={`w-full max-w-[1440px] rounded-full transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-white/70 backdrop-blur-md"
        } py-2 px-4`}
      >
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Eight Hands Work" width={130} height={52} className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navLinks.map((link) => 
              link.hasDropdown ? (
                <div className="relative" key={link.name} ref={megaMenuTriggerRef}>
                  <button
                    onClick={toggleMegaMenu}
                    className={`flex items-center text-base font-medium hover:text-amber-500 transition-colors ${
                      pathname.startsWith(link.href) ? "text-amber-500" : ""
                    }`}
                  >
                    {link.name}
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isMegaMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-medium hover:text-amber-500 transition-colors ${pathname === link.href ? "text-amber-500" : ""}`}
                >
                  {link.name}
                </Link>
              )
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className={`text-base font-medium text-amber-500 hover:text-amber-600 transition-colors flex items-center`}
              >
                <Settings className="h-4 w-4 mr-1" />
                Admin
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-5">
            {/* Search Icon */}
            <button onClick={toggleSearch} className="relative">
              <Search className="h-5 w-5" />
            </button>

            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-xs rounded-full h-4.5 w-4.5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={accountMenuRef}>
                <button onClick={toggleAccountMenu} aria-label="Account menu">
                  <User className="h-5 w-5 fill-black" />
                </button>
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/account"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-3 py-2 text-sm font-medium text-amber-500 hover:bg-amber-50"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut()
                        setIsAccountMenuOpen(false)
                        router.push("/")
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" aria-label="Login">
                <User className="h-5 w-5" />
              </Link>
            )}
          </div>

          <button className="md:hidden" onClick={toggleMenu}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg w-full max-w-xl mx-4 overflow-hidden">
>>>>>>> friend/main
            <form onSubmit={handleSearch} className="flex items-center p-4">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for products..."
<<<<<<< HEAD
                className="flex-1 p-2 border-b-2 border-gray-200 focus:border-amber-500 outline-none text-lg"
=======
                className="flex-1 p-2 border-b-2 border-gray-200 focus:border-amber-500 outline-none text-base"
>>>>>>> friend/main
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="ml-4 text-amber-500 hover:text-amber-600">
<<<<<<< HEAD
                <Search className="h-6 w-6" />
=======
                <Search className="h-5 w-5" />
>>>>>>> friend/main
              </button>
              <button 
                type="button" 
                onClick={() => setIsSearchOpen(false)} 
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
<<<<<<< HEAD
                <X className="h-6 w-6" />
=======
                <X className="h-5 w-5" />
>>>>>>> friend/main
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mega Menu - positioned outside the header container for full width */}
      {isMegaMenuOpen && (
        <div ref={megaMenuRef} className="fixed left-0 right-0 top-20 z-40">
          <MegaMenu onClose={() => setIsMegaMenuOpen(false)} />
        </div>
      )}

<<<<<<< HEAD
      {/* Mobile menu - redesigned to match the provided image */}
=======
      {/* Mobile menu */}
>>>>>>> friend/main
      <div
        className={`fixed inset-0 bg-white z-50 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
<<<<<<< HEAD
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={closeMenu} className="p-1">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)]">
=======
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={closeMenu} className="p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-56px)]">
>>>>>>> friend/main
          {/* Search in mobile menu */}
          <div className="p-4 border-b">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Search for products..."
<<<<<<< HEAD
                className="flex-1 p-2 border rounded-l-md border-gray-300 focus:outline-none"
=======
                className="flex-1 p-2 text-sm border rounded-l-md border-gray-300 focus:outline-none"
>>>>>>> friend/main
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-amber-500 text-white p-2 rounded-r-md"
              >
<<<<<<< HEAD
                <Search className="h-5 w-5" />
=======
                <Search className="h-4 w-4" />
>>>>>>> friend/main
              </button>
            </form>
          </div>

          <nav className="p-4">
<<<<<<< HEAD
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className={`block py-2 text-lg ${pathname === "/" ? "text-amber-500 font-medium" : ""}`}
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  className={`block py-2 text-lg ${pathname === "/products" ? "text-amber-500 font-medium" : ""}`}
                  onClick={closeMenu}
                >
                  All Products
                </Link>
              </li>

              {/* Product Categories Section */}
              <li className="pt-4">
                <h3 className="text-gray-500 uppercase text-sm font-medium mb-2">PRODUCT CATEGORIES</h3>
                <ul className="space-y-2">
                  {Object.entries(categoryGroups).map(([name, href]) => (
                    <li key={name}>
                      <Link href={href} className="block py-2 text-gray-700" onClick={closeMenu}>
=======
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`block py-2 text-sm ${pathname === link.href || (link.hasDropdown && pathname.startsWith(link.href)) ? "text-amber-500 font-medium" : ""}`}
                    onClick={closeMenu}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {/* Product Categories Section */}
              <li className="pt-3">
                <h3 className="text-gray-500 uppercase text-xs font-medium mb-2">PRODUCT CATEGORIES</h3>
                <ul className="space-y-2">
                  {Object.entries(categoryGroups).map(([name, href]) => (
                    <li key={name}>
                      <Link href={href} className="block py-1.5 text-sm text-gray-700" onClick={closeMenu}>
>>>>>>> friend/main
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

<<<<<<< HEAD
              <li>
                <Link
                  href="/about"
                  className={`block py-2 text-lg ${pathname === "/about" ? "text-amber-500 font-medium" : ""}`}
                  onClick={closeMenu}
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className={`block py-2 text-lg ${pathname === "/contact" ? "text-amber-500 font-medium" : ""}`}
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </li>

              <li className="pt-4">
=======
              <li className="pt-3">
>>>>>>> friend/main
                <Link href="/cart" className="flex items-center py-2" onClick={closeMenu}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  <span>Cart ({cartItems.length})</span>
                </Link>
              </li>

              <li>
                {user ? (
                  <div className="space-y-2">
<<<<<<< HEAD
                    <Link href="/account" className="block py-2" onClick={closeMenu}>
                      My Account
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="block py-2 text-amber-500" onClick={closeMenu}>
=======
                    <Link href="/account" className="flex items-center py-2" onClick={closeMenu}>
                      <User className="h-5 w-5 mr-2 fill-black" />
                      <span>My Account</span>
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="block py-2 text-sm text-amber-500" onClick={closeMenu}>
>>>>>>> friend/main
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut()
                        closeMenu()
                        router.push("/")
                      }}
<<<<<<< HEAD
                      className="block py-2 text-red-600"
=======
                      className="block py-2 text-sm text-red-600"
>>>>>>> friend/main
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="flex items-center py-2" onClick={closeMenu}>
                    <User className="h-5 w-5 mr-2" />
                    <span>Login / Register</span>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
<<<<<<< HEAD
    </header>
  )
}
=======
    </div>
  )
}
>>>>>>> friend/main
