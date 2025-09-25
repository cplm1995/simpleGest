const Footer = () => {
  return (
    <div className="container-sm">
      <footer className="bg-light text-center text-muted py-3 shadow-sm">
        <div className="container"> {/* 👈 Se adapta según el tamaño de pantalla */}
          <small>
            © {new Date().getFullYear()} SimpleGest - Todos los derechos reservados. Desarrollado por <a href="https://github.com/cplm1995" target="_blank" rel="noopener noreferrer">Cristian Palacio</a>
          </small>
        </div>
      </footer>
    </div>
  )
}

export default Footer
