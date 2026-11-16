import { createService } from '../createService'
import * as v1 from './v1'
import * as v2 from './v2'

export const statementService = createService('statement', { v1, v2 })
