import { addScannedExhibitId } from '../src/lib/scanProgress.js'

function expect(actual, expected, label) {
  const actualJson = JSON.stringify(actual)
  const expectedJson = JSON.stringify(expected)
  if (actualJson !== expectedJson) {
    console.error('FAIL ' + label + ' — expected ' + expectedJson + ', got ' + actualJson)
    process.exitCode = 1
    return
  }
  console.log('OK  ' + label)
}

expect(addScannedExhibitId([], 'PSBIKT-001'), ['PSBIKT-001'], 'first scan is counted')
expect(addScannedExhibitId(['PSBIKT-001'], 'PSBIKT-001'), ['PSBIKT-001'], 'duplicate scan is not counted twice')
expect(addScannedExhibitId(['PSBIKT-001'], 'PSBIKT-002'), ['PSBIKT-001', 'PSBIKT-002'], 'second distinct exhibit is counted')
expect(addScannedExhibitId(['PSBIKT-001'], ''), ['PSBIKT-001'], 'empty exhibit id is ignored')

if (process.exitCode) {
  console.error('Scan progress self-check failed')
  process.exit(1)
}

console.log('All scan progress self-checks passed')
