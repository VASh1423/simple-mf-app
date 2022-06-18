import './style.scss'

export const Counter = () => {
  return (
    <div className='counter'>
      <div>Counter: </div>
      <div>
        <button className='btn green'>+1</button>
        <button className='btn red'>-1</button>
      </div>
    </div>
  )
}
