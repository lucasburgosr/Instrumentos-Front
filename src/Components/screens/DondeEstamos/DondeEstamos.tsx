const DondeEstamos = () => {
  return (
      <div className="div-ubicacion" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <h2 className="donde-estamos-title" style={{ fontFamily: 'Helvetica', textAlign: 'center' }}>¿Dónde estamos? </h2>
          <p style={{ fontFamily: 'Helvetica', textAlign: 'center' }}>Av. Las Heras y Av. San Martin, Ciudad de Mendoza</p>
          <iframe
              className="google-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1743.2791655413285!2d-68.84340885511408!3d-32.88687934116792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967b09b2a8893d6d%3A0x1f19ad4fb5fc9e33!2sAv.%20San%20Mart%C3%ADn%20%26%20Av.%20Las%20Heras%2C%20Mendoza!5e0!3m2!1ses!2sar!4v1620749271061!5m2!1ses!2sar"
              width="900"
              height="400"
              loading="lazy"
              title="Mapa de Google"
          ></iframe>
      </div>
  )
}

export default DondeEstamos;
