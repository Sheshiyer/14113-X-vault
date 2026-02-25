export default function TestCSS() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl mb-8">CSS Variable Test</h1>
      
      <div className="space-y-4">
        {/* Test 1: Direct inline styles with CSS variables */}
        <div style={{
          backgroundColor: 'var(--color-octave)',
          color: 'var(--color-text)',
          padding: '2rem',
          borderRadius: '0.5rem'
        }}>
          Test 1: Inline styles with CSS variables
        </div>
        
        {/* Test 2: Tailwind utility classes */}
        <div className="bg-octave text-text p-8 rounded-lg">
          Test 2: Tailwind utility classes (bg-octave)
        </div>
        
        {/* Test 3: Surface color */}
        <div className="bg-surface-elevated p-8 rounded-lg">
          Test 3: Surface elevated background
        </div>
        
        {/* Test 4: All power number colors */}
        <div className="flex gap-4 flex-wrap">
          <div className="bg-octave p-4 rounded">Octave</div>
          <div className="bg-transform p-4 rounded">Transform</div>
          <div className="bg-solar p-4 rounded text-surface">Solar</div>
          <div className="bg-build p-4 rounded">Build</div>
          <div className="bg-witness p-4 rounded">Witness</div>
          <div className="bg-unity p-4 rounded">Unity</div>
          <div className="bg-creative p-4 rounded">Creative</div>
        </div>
        
        {/* Test 5: Show computed styles */}
        <div className="bg-surface-elevated p-8 rounded-lg">
          <p>Check DevTools computed styles for this element</p>
          <p className="text-text-muted mt-2">Should see --color-surface-elevated applied</p>
        </div>
      </div>
    </div>
  );
}
