import React, { useState } from "react";
import Sugeno from "../assets/Sugeno.png";
import Mamdami from "../assets/mamdami_dan_tsukamoto.png";

function Form() {
  const [tinggiBadan, setTinggiBadan] = useState({
    pendek: 0,
    sedang: 0,
    tinggi: 0,
  });

  const [beratBadan, setBeratBadan] = useState({
    ringan: 0,
    sedang: 0,
    berat: 0,
  });

  //sugeno
  const [hasilBMI, setHasilBMI] = useState(0);

  //mamdani
  const [mamdani, setMamdani] = useState(0);

  //Tsukamoto
  const [Tsukamoto, setTsukamoto] = useState(0);

  const LinierNaik = (a, b) => {
    return (x) => {
      if (x < a) return 0;
      else if (x >= a && x <= b) return (x - a) / (b - a);
      else return 1;
    };
  };

  const LinierTurun = (a, b) => {
    return (x) => {
      if (x < a) return 1;
      else if (x >= a && x <= b) return (b - x) / (b - a);
      else return 0;
    };
  };

  const trapesium = (a, b, c, d) => {
    return (x) => {
      if (x < a || x > d) return 0;
      else if (x >= a && x <= b) return (x - a) / (b - a);
      else if (x > b && x < c) return 1;
      else return (d - x) / (d - c);
    };
  };

  const segitiga = (a, b, c) => {
    return (x) => {
      if (x < a || x > c) return 0;
      else if (x >= a && x <= b) return (x - a) / (b - a);
      else return (c - x) / (c - b);
    };
  };

  function mf_TinggiBadan(x) {
    let pendek = LinierTurun(150, 165)(x);
    let sedang = segitiga(150, 165, 175)(x);
    let tinggi = LinierNaik(160, 175)(x);
    return {
      pendek,
      sedang,
      tinggi,
    };
  }

  function mf_BeratBadan(x) {
    let ringan = LinierTurun(40, 55)(x);
    let sedang = segitiga(45, 55, 65)(x);
    let berat = LinierNaik(55, 75)(x);

    return {
      ringan,
      sedang,
      berat,
    };
  }

  function mf_bmi(x) {
    let sangat_kurus = LinierTurun(16, 17)(x);
    let kurus = segitiga(16, 17, 18.5)(x);
    let normal = trapesium(17, 18.5, 24, 25)(x);
    let berat = trapesium(24, 25, 26, 27)(x);
    let obesitas = LinierNaik(26, 27)(x);

    return {
      sangat_kurus,
      kurus,
      normal,
      berat,
      obesitas,
    };
  }

  function mf_bmi_singleton() {
    return {
      sangat_kurus: 16,
      kurus: 18.5,
      normal: 23,
      berat: 24,
      obesitas: 25,
    };
  }

  function mf_bmi_tsukamoto(sangat_kurus, kurus, normal, berat, obesitas) {
    return {
      sangat_kurus: ((17 - 16) * sangat_kurus - 17) * -1,
      kurus: ((18.5 - 17) * kurus - 18.5) * -1,
      normal: ((25 - 24) * normal - 25) * -1,
      berat: ((27 - 26) * berat - 27) * -1,
      obesitas: (27 - 26) * obesitas + 27,
    };
  }

  function hitungAturan() {
    let sangat_kurus = [];
    let kurus = [];
    let normal = [];
    let berat = [];
    let obesitas = [];

    normal.push(Math.min(beratBadan.ringan, tinggiBadan.pendek));
    kurus.push(Math.min(beratBadan.ringan, tinggiBadan.sedang));
    sangat_kurus.push(Math.min(beratBadan.ringan, tinggiBadan.tinggi));

    berat.push(Math.min(beratBadan.sedang, tinggiBadan.pendek));
    normal.push(Math.min(beratBadan.sedang, tinggiBadan.sedang));
    kurus.push(Math.min(beratBadan.sedang, tinggiBadan.tinggi));

    obesitas.push(Math.min(beratBadan.berat, tinggiBadan.pendek));
    berat.push(Math.min(beratBadan.berat, tinggiBadan.sedang));
    normal.push(Math.min(beratBadan.berat, tinggiBadan.tinggi));

    sangat_kurus = Math.max(...sangat_kurus);
    kurus = Math.max(...kurus);
    normal = Math.max(...normal);
    berat = Math.max(...berat);
    obesitas = Math.max(...obesitas);

    // Defuzz singleton Sugeno
    const nilaiBMI = mf_bmi_singleton();
    let hasil = nilaiBMI.sangat_kurus * sangat_kurus + nilaiBMI.kurus * kurus + nilaiBMI.normal * normal + nilaiBMI.berat * berat + nilaiBMI.obesitas * obesitas;
    hasil = hasil / (sangat_kurus + kurus + normal + berat + obesitas);
    setHasilBMI(hasil);
    console.log("Berat Badan : " + hasil);

    // defuzzy Trsukamoto
    const nilaiBMITsu = mf_bmi_tsukamoto(sangat_kurus, kurus, normal, berat, obesitas);
    let hasilTsu = nilaiBMITsu.sangat_kurus * sangat_kurus + nilaiBMITsu.kurus * kurus + nilaiBMITsu.normal * normal + nilaiBMITsu.berat * berat + nilaiBMITsu.obesitas * obesitas;
    hasilTsu = hasilTsu / (sangat_kurus + kurus + normal + berat + obesitas);
    setTsukamoto(hasilTsu);
    console.log("Berat Badan : " + hasilTsu);

    // defuzzy Mamdami
    let a = 0;
    let b = 0;

    let awal = 1; // Nilai awal variabel i
    let finalValue = 32; // Nilai akhir yang diinginkan
    let step = 1; // Langkah perubahan nilai i
    // ...

    for (var i = awal; i <= finalValue; i += step) {
      let bmiNya = mf_bmi(i); // Menghitung nilai fuzzy dari i
      // Menghitung nilai c
      let c = Math.max(Math.min(bmiNya.sangat_kurus, sangat_kurus), Math.min(bmiNya.kurus, kurus), Math.min(bmiNya.normal, normal), Math.min(bmiNya.berat, berat), Math.min(bmiNya.obesitas, obesitas));

      a += i * c;
      b += c;
    }

    // Periksa jika sb adalah 0 untuk menghindari pembagian dengan nol
    let hasilMamdani = a / b;
    setMamdani(hasilMamdani);

    console.log("Kelayakan Mamdani : " + hasilMamdani);
  }

  const calculateTinggiBadan = (x) => {
    const hasilPerhitungan = mf_TinggiBadan(x);
    setTinggiBadan(hasilPerhitungan);
  };

  const calculateBeratBadan = (x) => {
    const hasil = mf_BeratBadan(x);
    setBeratBadan(hasil);
  };

  return (
    <>
      <form className="Form" action="/">
        <label>
          Masukkan Nilai Tinggi : <input type="text" onChange={(e) => calculateTinggiBadan(parseFloat(e.target.value))} />
        </label>
        <br />
        <label>
          Masukkan Berat Badan : <input type="text" onChange={(e) => calculateBeratBadan(parseFloat(e.target.value))} />
        </label>
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            hitungAturan();
          }}
        >
          Hitung BMI
        </button>
      </form>
      <div className="hasilTinggi">
        <p>Tinggi Badan (Pendek): {tinggiBadan.pendek}</p>
        <p>Tinggi Badan (Sedang): {tinggiBadan.sedang}</p>
        <p>Tinggi Badan (Tinggi): {tinggiBadan.tinggi}</p>
      </div>
      <div className="hasilBerat">
        <p>Berat Badan (ringan): {beratBadan.ringan}</p>
        <p>Berat Badan (Sedang): {beratBadan.sedang}</p>
        <p>Berat Badan (Berat): {beratBadan.berat}</p>
      </div>
      <h3>Hasil BMI Metode Mamdani : {mamdani}</h3>
      <h3>Hasil BMI Metode Sugeno : {hasilBMI}</h3>
      <h3>Hasil BMI Metode Tsukamoto : {Tsukamoto} </h3>

      <div>
        <h3>Kurva Untuk Methode Mamdami dan Tsukamoto</h3>
        <img src={Mamdami} />
        <h3>Kurva Untuk Metode Sugeno</h3>
        <img src={Sugeno} />
      </div>
    </>
  );
}

export default Form;
