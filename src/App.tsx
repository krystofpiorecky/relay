import { Feed } from '@components/Feed'
import { Titlebar } from '@components/Titlebar'
import './App.css'

function App() {
  return <>
    <Titlebar />
    <main>
      <section>
        nav
      </section>
      <Feed />
      <section>
        detail
      </section>
    </main>
  </>
}

export default App
