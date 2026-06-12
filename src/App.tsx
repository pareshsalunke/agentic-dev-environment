import { DemoProvider, useDemo } from './demo/DemoContext'
import { TopBar } from './components/TopBar'
import { DemoControls } from './components/DemoControls'
import { Toast } from './components/Toast'
import { Workbench } from './components/workbench/Workbench'
import { ImpactView } from './components/impact/ImpactView'
import { PlaybooksView } from './components/playbooks/PlaybooksView'

export default function App() {
  return (
    <DemoProvider>
      <Shell />
    </DemoProvider>
  )
}

function Shell() {
  const { state } = useDemo()
  return (
    <div className="flex h-full min-w-[1280px] flex-col">
      <TopBar />
      <main className="min-h-0 flex-1">
        {state.tab === 'workbench' && <Workbench />}
        {state.tab === 'playbooks' && <PlaybooksView />}
        {state.tab === 'impact' && <ImpactView />}
      </main>
      <DemoControls />
      <Toast />
    </div>
  )
}
