import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DashboardReportes() {
  const [activeTab, setActiveTab] = useState("ocupacion");
  const [anioSeleccionado, setAnioSeleccionado] = useState(2026);
  const [ocupacionDiaria, setOcupacionDiaria] = useState([]);
  const [ocupacionSemanal, setOcupacionSemanal] = useState([]);
  const [ingresosMensual, setIngresosMensual] = useState([]);
  const [ingresosAnual, setIngresosAnual] = useState(0);
  const [huespedes, setHuespedes] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const cargarReporte = async (tipo) => {
    try {
      if (tipo === "ocupacion") {
        const resDiaria = await axios.get(`${API_URL}/reportes/ocupacion-diaria`, {
          params: { inicio: `${anioSeleccionado}-01-01`, fin: `${anioSeleccionado}-12-31` }
        });
        setOcupacionDiaria(resDiaria.data);

        const resSemanal = await axios.get(`${API_URL}/reportes/ocupacion-semanal`, {
          params: { inicio: `${anioSeleccionado}-01-01`, fin: `${anioSeleccionado}-12-31` }
        });
        setOcupacionSemanal(resSemanal.data);

        setActiveTab("ocupacion");
      }

      if (tipo === "ingresos") {
        const resMensual = await axios.get(`${API_URL}/reportes/ingresos-mensual`, {
          params: { anio: anioSeleccionado }
        });
        setIngresosMensual(resMensual.data);

        const resAnual = await axios.get(`${API_URL}/reportes/ingresos-anual`, {
          params: { anio: anioSeleccionado }
        });
        setIngresosAnual(resAnual.data || 0);

        setActiveTab("ingresos");
      }

      if (tipo === "huespedes") {
        const resHuespedes = await axios.get(`${API_URL}/reportes/huespedes`, {
          params: { inicio: `${anioSeleccionado}-01-01`, fin: `${anioSeleccionado}-12-31` }
        });
        setHuespedes(resHuespedes.data);

        setActiveTab("huespedes");
      }
    } catch (err) {
      console.error("Error cargando reporte:", err);
    }
  };

  // 🔹 Nombres de los meses en español
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // 🔹 Construir arreglo de 12 meses con ingresos (rellenar con 0 si no hay datos)
  const ingresosPorMes = Array(12).fill(0);
  ingresosMensual.forEach((fila) => {
    const mes = fila[0];   // número de mes (1-12) que devuelve el backend
    const monto = fila[1]; // total de ingresos
    ingresosPorMes[mes - 1] = monto; // ajustar índice (enero=0)
  });

  // 🔹 Configuración del gráfico
  const ingresosChartData = {
    labels: monthNames,
    datasets: [
      {
        label: "Ingresos",
        data: ingresosPorMes,
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }
    ]
  };

  const ingresosChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Ingresos vs Mes (${anioSeleccionado})` }
    }
  };

  const tableStyle = { width: "100%", textAlign: "center", borderCollapse: "collapse" };
  const cellStyle = { textAlign: "center", padding: "8px", border: "1px solid #ccc" };

  return (
    <div>
      <h1>📊 Dashboard de Reportes</h1>

      {/* Selector de año */}
      <div style={{ marginBottom: "20px" }}>
        <label>Seleccionar año: </label>
        <select value={anioSeleccionado} onChange={(e) => setAnioSeleccionado(e.target.value)}>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => cargarReporte("ocupacion")}>Ocupación</button>
        <button onClick={() => cargarReporte("ingresos")}>Ingresos</button>
        <button onClick={() => cargarReporte("huespedes")}>Huéspedes</button>
      </div>

      {activeTab === "ocupacion" && (
        <div>
          <h2>Reporte de Ocupación Diaria</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Fecha</th>
                <th style={cellStyle}>Habitaciones ocupadas</th>
              </tr>
            </thead>
            <tbody>
              {ocupacionDiaria.map((fila, i) => (
                <tr key={i}>
                  <td style={cellStyle}>{fila[0]}</td>
                  <td style={cellStyle}>{fila[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={{ marginTop: "30px" }}>Reporte de Ocupación Semanal</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Semana</th>
                <th style={cellStyle}>Habitaciones ocupadas</th>
              </tr>
            </thead>
            <tbody>
              {ocupacionSemanal.map((fila, i) => (
                <tr key={i}>
                  <td style={cellStyle}>{fila[0]}</td>
                  <td style={cellStyle}>{fila[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "ingresos" && (
        <div>
          <h2>Reporte de Ingresos Mensual</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Mes</th>
                <th style={cellStyle}>Total Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {monthNames.map((mes, i) => (
                <tr key={i}>
                  <td style={cellStyle}>{mes}</td>
                  <td style={cellStyle}>${ingresosPorMes[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={{ marginTop: "30px" }}>Reporte de Ingresos Anual</h2>
          <h3 style={{ textAlign: "center" }}>🔹 Total Anual: ${ingresosAnual}</h3>

          <div style={{ marginTop: "30px" }}>
            <h3 style={{ textAlign: "center" }}>Ingresos vs Mes</h3>
            <Bar data={ingresosChartData} options={ingresosChartOptions} />
          </div>
        </div>
      )}

      {activeTab === "huespedes" && (
        <div>
          <h2>Lista de Huéspedes</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Nombre</th>
                <th style={cellStyle}>Apellido</th>
                <th style={cellStyle}>Correo</th>
                <th style={cellStyle}>Ingreso</th>
                <th style={cellStyle}>Salida</th>
                <th style={cellStyle}>Habitación</th>
                <th style={cellStyle}>Estado</th>
              </tr>
            </thead>
            <tbody>
                           {huespedes.map((fila, i) => (
                <tr key={i}>
                  <td style={cellStyle}>{fila[0]}</td>
                  <td style={cellStyle}>{fila[1]}</td>
                  <td style={cellStyle}>{fila[2]}</td>
                  <td style={cellStyle}>{fila[3]}</td>
                  <td style={cellStyle}>{fila[4]}</td>
                  <td style={cellStyle}>{fila[5]}</td>
                  <td style={cellStyle}>{fila[6]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardReportes;
