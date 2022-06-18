import { Topbar } from './Components/Topbar';

import { Counter } from 'counter/Counter'
import { Leftbar } from 'leftbar/Leftbar'

import './styles/App.scss'

const App: React.FC = () => {
  return (
    <div className='container'>
      <Topbar/>
      <div className='center'>
        <Leftbar/>
        <Counter/>
      </div>
    </div>
  )
};

export default App;