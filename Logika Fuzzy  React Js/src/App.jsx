import Form from "./komponen/Form";
import Footer from "./komponen/Footer";

function App() {
  return (
    <div className="container">
      <div className="judul">
        <h1>Logika Fuzzy</h1>
        <p>Studi Kasus Menghitung BMI</p>
        <h4>Andri Efendy</h4>
      </div>
      <Form />
      <Footer />
    </div>
  );
}

export default App;
