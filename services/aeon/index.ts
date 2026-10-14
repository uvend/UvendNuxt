import { createService } from '../createService'
import * as v1 from './v1'
import * as v2 from './v2'

export const aeonService = createService('aeon', { v1, v2 })
