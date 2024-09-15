import './App.css';
import UrlShortener from './components/UrlShortener';
import UrlList from './components/UrlList';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <UrlShortener />
        </div>
        <div>
          <h1>Painel de Estatísticas de URLs Encurtadas</h1>
          <UrlList />
        </div>
      </header>
    </div>
  );
}

export default App;
