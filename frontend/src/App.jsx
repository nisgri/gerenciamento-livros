import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<ItemList />} />
          <Route path="/cadastro" element={<ItemForm />} />
          <Route path="/editar/:id" element={<ItemForm />} />
        </Routes>
      </main>
    </>
  );
}
