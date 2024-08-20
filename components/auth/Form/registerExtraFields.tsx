export default function RegisterExtraFields() {
  return (
    <div>
      <div>
        <label htmlFor="firstName" className="block text-xs text-gray-600 uppercase">
          Nombre
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="lastName" className="block text-xs text-gray-600 uppercase mt-5">
          Apellido
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      {/* <div>
        <label htmlFor="organization" className="block text-xs text-gray-600 uppercase mt-5">
          Organización
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div> */}
    </div>
  )
}
