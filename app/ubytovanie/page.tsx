"use client"

import Image from "next/image"
import Script from "next/script"

export default function UbytovaniePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8">Ubytovanie vo vinárstve</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <Image
            src="/ubytovanie/izba1.webp"
            alt="Izba s výhľadom na vinohrad"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-4">Komfortné ubytovanie s výhľadom na vinice</h2>
          <p className="text-lg text-gray-700 mb-4">
            Doprajte si jedinečný zážitok z pobytu priamo vo vinárstve. Naše moderne zariadené izby 
            ponúkajú dokonalý komfort a nezabudnuteľný výhľad na malebné vinohrady Malokarpatského regiónu.
          </p>
          <p className="text-lg text-gray-700">
            Každá izba je vybavená vlastnou kúpeľňou, klimatizáciou a bezplatným Wi-Fi pripojením. 
            Hostia majú k dispozícii aj spoločenskú miestnosť s vinotékou a terasu s posedením.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div>
          <Image
            src="/ubytovanie/izba2.webp"
            alt="Interiér izby"
            width={400}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div>
          <Image
            src="/ubytovanie/izba3.webp"
            alt="Kúpeľňa"
            width={400}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div>
          <Image
            src="/ubytovanie/izba4.webp"
            alt="Terasa s výhľadom"
            width={400}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="bg-amber-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-center">Rezervujte si pobyt</h2>
        <Script src="https://booking.previo.app/iframe/" />
        <iframe 
          src="https://booking.previo.app/?hotId=782975" 
          scrolling="no" 
          frameBorder="0" 
          width="100%" 
          height="2000" 
          name="previo-booking-iframe" 
          id="previo-booking-iframe" 
          allowTransparency={true}
        />
        {/* Reservation PLUS end */}
      </div>
    </div>
  )
}
