import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from '../lib/supabase'
import "../styles/app.css";

export function ElectionResults() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedPanchayat, setSelectedPanchayat] = useState("");
  const [selectedYear, setSelectedYear] = useState("2016");
  const [districts, setDistricts] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [panchayats, setPanchayats] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

  // Fetch districts on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      const { data: districtData } = await supabase
        .from('districts')
        .select('district')
        .order('district');
      
      if (districtData) {
        const uniqueDistricts = districtData.map(d => ({ district: d.district }));
        setDistricts(uniqueDistricts);
      }
      setIsLoading(false);
    };
    fetchDistricts();
  }, []);

  // Fetch blocks when district selected
  useEffect(() => {
    if (selectedDistrict) {
      const fetchBlocks = async () => {
        const { data: blockData } = await supabase
          .from('blocks')
            .select('block')
            .eq('district', selectedDistrict)
            .order('block');
        
        if (blockData) {
          const uniqueBlocks = blockData.map(b => ({ block: b.block }));
          setBlocks(uniqueBlocks);
        }
      };
      fetchBlocks();
    }
  }, [selectedDistrict]);

  // Fetch panchayats when block selected
  useEffect(() => {
    if (selectedDistrict && selectedBlock) {
      const fetchPanchayats = async () => {
        const { data: panchayatData } = await supabase
          .from('panchayats')
            .select('panchayat')
            .eq('district', selectedDistrict)
            .eq('block', selectedBlock)
            .order('panchayat');
        
        if (panchayatData) {
          const uniquePanchayats = panchayatData.map(p => ({ panchayat: p.panchayat }));
          setPanchayats(uniquePanchayats);
        }
      };
      fetchPanchayats();
    }
  }, [selectedDistrict, selectedBlock]);

  // Fetch results when panchayat selected
  useEffect(() => {
    if (selectedDistrict && selectedBlock && selectedPanchayat) {
      const fetchResults = async () => {
        const { data } = await supabase
          .from('election_results')
            .select('*')
            .eq('district', selectedDistrict)
            .eq('block', selectedBlock)
            .eq('panchayat', selectedPanchayat)
            .eq('election_year', selectedYear)
            .order('voters', { ascending: false });
        
        if (data) {
          // Remove duplicate candidates by candidate_name
          const uniqueResults = data.filter((item, index, self) =>
            index === self.findIndex(t => t.candidate_name === item.candidate_name)
          );
          setResults(uniqueResults);
        }
      };
      fetchResults();
    }
  }, [selectedDistrict, selectedBlock, selectedPanchayat, selectedYear]);

  const totalVotes = results.reduce((sum, result) => sum + (result.voters || 0), 0);

  if (isLoading) {
    return (
      <div className="login-page">
        <header className="login-top">
          <div className="login-top-row">
            <Link to="/" className="back-link">
              ← Back · होम
            </Link>
          </div>
          <div className="login-brand">
            <span className="flag-dot" aria-hidden />
            <span>
              <strong>Chunav Mitra</strong>
              <small>Election Results · चुनाव परिणाम</small>
            </span>
          </div>
        </header>
        <main className="login-main">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "2rem" }}>Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="login-page">
      <header className="login-top">
        <div className="login-top-row">
          <Link to="/" className="back-link">
            ← Back · होम
          </Link>
        </div>
        <div className="login-brand">
          <span className="flag-dot" aria-hidden />
          <span>
            <strong>Chunav Mitra</strong>
            <small>Election Results · चुनाव परिणाम</small>
          </span>
        </div>
      </header>

      <main className="login-main">
        <div style={{ padding: "1rem" }}>
          <h1 className="page-title" style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
            {selectedYear} Mukhiya Chunav Results · {selectedYear} मुखिया चुनाव परिणाम
          </h1>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <div>
              <label className="field-label">Election Year · चुनाव वर्ष</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{ width: "100%", padding: "0.5rem" }}
              >
                <option value="2016">2016</option>
                <option value="2021">2021</option>
              </select>
            </div>
            <div>
              <label className="field-label">District · ज़िला</label>
              <select 
                value={selectedDistrict} 
                onChange={(e) => setSelectedDistrict(e.target.value)}
                style={{ width: "100%", padding: "0.5rem" }}
              >
                <option value="">Apna District chuniye · अपना ज़िला चुनिए</option>
                {districts.map((dist: any, index: number) => (
                  <option key={index} value={dist.district}>
                    {dist.district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Block · प्रखंड</label>
              <select 
                value={selectedBlock} 
                onChange={(e) => setSelectedBlock(e.target.value)}
                disabled={!selectedDistrict}
                style={{ width: "100%", padding: "0.5rem" }}
              >
                <option value="">Select Block · प्रखंड चुनिए</option>
                {blocks.map((blk: any, index: number) => (
                  <option key={index} value={blk.block}>
                    {blk.block}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Panchayat · पंचायत</label>
              <select 
                value={selectedPanchayat} 
                onChange={(e) => setSelectedPanchayat(e.target.value)}
                disabled={!selectedDistrict || !selectedBlock}
                style={{ width: "100%", padding: "0.5rem" }}
              >
                <option value="">Select Panchayat · पंचायत चुनिए</option>
                {panchayats.map((panch: any, index: number) => (
                  <option key={index} value={panch.panchayat}>
                    {panch.panchayat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedPanchayat && (
            <>
              <h2 className="page-title" style={{ fontSize: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>
                {selectedPanchayat} Panchayat Results · {selectedPanchayat} पंचायत परिणाम
              </h2>

              {results.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <thead>
                      <tr style={{ backgroundColor: "var(--primary)", color: "white" }}>
                        <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Rank · रैंक</th>
                        <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Candidate Name · उम्मीदवार का नाम</th>
                        <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Father Name · पिता का नाम</th>
                        <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Votes Obtained · प्राप्त वोट</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result: any, index: number) => (
                        <tr 
                          key={index} 
                          style={{ 
                            backgroundColor: index === 0 ? "#d4edda" : "white",
                            fontWeight: index === 0 ? "bold" : "normal"
                          }}
                        >
                          <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                            {index + 1}
                            {index === 0 && <span style={{ marginLeft: "8px" }}>🏆</span>}
                          </td>
                          <td style={{ padding: "12px", border: "1px solid #ddd" }}>{result.candidate_name}</td>
                          <td style={{ padding: "12px", border: "1px solid #ddd" }}>{result.father_name}</td>
                          <td style={{ padding: "12px", border: "1px solid #ddd", fontWeight: index === 0 ? "bold" : "normal" }}>
                            {result.voters}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ textAlign: "center", marginTop: "2rem", padding: "1rem", backgroundColor: "var(--muted-bg)", borderRadius: "8px" }}>
                    <h3 style={{ margin: "0 0 1rem 0", color: "var(--primary)" }}>
                      Total Votes · कुल वोट: {totalVotes.toLocaleString('en-IN')}
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>
                      {selectedYear} Mukhiya Chunav Results for {selectedPanchayat} Panchayat
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <p>No results found for {selectedPanchayat} in {selectedYear}</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
