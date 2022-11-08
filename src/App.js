import React, { memo } from "react";
import { Routes, Route } from 'react-router-dom';

import ProfList from "./pages/ProfList";
import ProfAdd from "./pages/ProfAdd";
import ProfEdit from "./pages/ProfEdit";

const App = memo(() => {
  return (
    <div>
      <h1>Exam 11</h1>

      <Routes>
        <Route path='/' exapt={true} element={<ProfList />} />
        <Route path='/add' element={<ProfAdd />} />
        <Route path='/edit/:id' element={<ProfEdit />} />
      </Routes>
    </div>
  );
});

export default App;
