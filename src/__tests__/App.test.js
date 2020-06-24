import React from 'react';
// this adds custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect'
import {render as rtlRender,waitFor} from '@testing-library/react'
import user from '@testing-library/user-event'
import {getProjectList as mockGetProjectList} from '../API/api'
import {postLogEntries as mockPostLogEntries} from '../API/api'
import {getLoggedTime as mockGetLoggedTime} from '../API/api'
import App from '../App';
import DateUtils from '@date-io/date-fns'

const dateFns = new DateUtils();

// [NOTE] rtlRender rename is for when you use a wrapper
//  for example, to wrap all rendered tests in a context/router provider

// api calls are tested ONLY during end-to-end testing
jest.mock('../API/api')

// Clear ALL jest mocks from this api module between tests
afterEach(() => {
  jest.clearAllMocks()
})

const fakeToken = '1234-2345'

const theme = {
  custom: {
  },
  palette: {
      primary: { main: '#0A2756', contrastText: "#fff" },
          secondary: { main: '#3cc5de', contrastText: "#fff" },
          white:'#fff',
          black:'#000',
          grey: { dark: '#A6A6A6', light: '#F2F2F2' },
          blue: {dark:'#0A2756', main:'#0080FF',blue2:'#0081C6',blue3:'#77B0DD'},
          green:{main:'#87CB9C'},
          red:{main:'#F47F64'},
          orange:{main:'#FFB32C'},
          error: { main: '#F47F64', contrastText: "#fff" },
          removeBoxShadow: {boxShadow: "none"},
      // Used by `getContrastText()` to maximize the contrast between the background and
      // the text.
      contrastThreshold: 3,
      // Used to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2,
  },
}

function renderApp() {

  const utils = rtlRender(<App themeObj = {theme} />)

  user.type(utils.getByLabelText(/token/i),fakeToken)

  const getProjectsBtn = utils.getByText(/Get Project IDs/i)

  return {
    getProjectsBtn,
    ...utils,
  }

}

function renderAppAfterListFetch() {

  // const utils = rtlRender(<App themeObj = {theme} />)
  const utils = renderApp()

  user.click(utils.getProjectsBtn)

  return {
    ...utils,
  }

}

test('token success login, page renders okay', async () => {
  mockGetProjectList.mockResolvedValue({result:{data:[
    {
      id: 123,
      name: 'proj1',
    },
    {
      id: 234,
      name: 'proj2',
    },
    {
      id: 345,
      name: 'proj3',
    },
  ]}})

  const {getByText, findAllByText, getByRole, getProjectsBtn} = renderApp();
 
  user.click(await getProjectsBtn)

  expect(mockGetProjectList).toHaveBeenCalledWith({"token": fakeToken})
  expect(mockGetProjectList).toHaveBeenCalledTimes(1)
  
  // since we're updating state inside the form, we wait for the below change to appear
  await waitFor(() => getByText(/create entries/i))
  const createBtn = getByText(/create entries/i)
  const viewBtn = getByText(/view entries/i)
  const plusBtn = getByRole(/img/i)
  const allLogItBtns = await waitFor(()=>findAllByText(/log it/i))

  expect(createBtn).toBeDisabled()
  expect(viewBtn).not.toBeDisabled()
  expect(allLogItBtns).toHaveLength(1)
  expect(allLogItBtns[0]).toBeDisabled()
  expect(plusBtn).toBeInTheDocument()

});


test('add max rows for entry', async () => {
  mockGetProjectList.mockResolvedValue({result:{data:[
    {
      id: 123,
      name: 'proj1',
    },
    {
      id: 234,
      name: 'proj2',
    },
    {
      id: 345,
      name: 'proj3',
    },
  ]}})

  const {getByText, findAllByText, findByRole} = renderAppAfterListFetch()
  
  // since we're updating state inside the form, we wait for the below change to appear
  await waitFor(() => getByText(/create entries/i))

  let plusBtn = findByRole(/PlusBtn/i)

  user.click(await plusBtn)
  let allLogItBtns = await waitFor(()=>findAllByText(/log it/i))
  expect(allLogItBtns).toHaveLength(2)
  
  user.click(await plusBtn)
  allLogItBtns = await waitFor(()=>findAllByText(/log it/i))
  expect(allLogItBtns).toHaveLength(3)
  
  user.click(await plusBtn)
  allLogItBtns = await waitFor(()=>findAllByText(/log it/i))
  expect(allLogItBtns).toHaveLength(4)

  expect(plusBtn).not.toBeInTheDocument()


});

test('Submit Entry, Success and Failure', async () => {
  mockGetProjectList.mockResolvedValueOnce({result:{data:[
    {
      id: 123,
      name: 'proj1',
    },
    {
      id: 234,
      name: 'proj2',
    },
    {
      id: 345,
      name: 'proj3',
    },
  ]}})
  mockGetProjectList.mockResolvedValueOnce({error: 'A Fake error occurred'})
  // test success response
  mockPostLogEntries.mockResolvedValueOnce({
    success: true,
  })
  // test error response
  mockPostLogEntries.mockResolvedValueOnce({
    error: 'THIS IS A FAKE ERROR',
  })

  const { findByText, getByTitle, getByLabelText, getByText, getAllByRole, getByRole} = renderAppAfterListFetch()

  // since we're updating state inside the form, we wait for the below change to appear
  await waitFor(() => getByText(/create entries/i))
  
  const minutesTextField = getByLabelText(/^minutes/i)
  const projectTextField = getByLabelText(/^project id/i)
  const tagsTextField = getByLabelText(/^tags/i)

  const startDateBtn = getByRole('button', {name: /change start date/i})
  const endDateBtn = getByRole('button', {name: /change end date/i})

  let fakeMin = 360
  let fakeProjId = 234
  let fakeTags = '#test #tag'

  user.type(minutesTextField,fakeMin.toString())
  user.click(projectTextField)
  user.click(getByText(/proj2/i))
  user.type(tagsTextField,fakeTags)
  
  expect(endDateBtn).toBeDisabled()

  // SELECT A START AND END DATE
  user.click(startDateBtn)

  // Grab the first day of the current month to avoid a false failure on the test.
  // this is due to the days after the current day being disabled
  let getDay // Saturday
  switch(dateFns.format(dateFns.startOfMonth(new Date()), "EEEE")) {
    case 'Sunday':
      getDay = 1
      break;
    case 'Monday':
      getDay = 2
      break;
    case 'Tueday':
      getDay = 3
      break;
    case 'Wednesday':
      getDay = 4
      break;
    case 'Thurday':
      getDay = 5
      break;
    case 'Friday':
      getDay = 6
      break;
    default:
      // Saturday
      getDay = 7
      break;
  }

  let firstSelectableDayButton = getAllByRole(/presentation/i)[getDay]

  user.click(firstSelectableDayButton)

  expect(endDateBtn).not.toBeDisabled()

  user.click(endDateBtn)
  user.click(getAllByRole(/presentation/i)[getDay])

  const logItBtn = await waitFor(()=>findByText(/log it/i))
  expect(logItBtn).not.toBeDisabled()

  await waitFor(()=>user.click(logItBtn))

  expect(mockPostLogEntries).toHaveBeenCalledTimes(1)

  const payloadObj = 
  JSON.stringify({
    "date":dateFns.format(dateFns.startOfMonth(new Date()), "yyyy-MM-dd"),
    "minutes":fakeMin,
    "project_id":fakeProjId,
    "description":fakeTags,
  })
  expect(mockPostLogEntries).toHaveBeenCalledWith({
    payload:payloadObj,
    "token": fakeToken
  })

  expect(getByTitle(/Success/i)).toBeInTheDocument()

  expect(logItBtn).toBeDisabled()

  // select date again to enable log it button, for error test
  user.click(startDateBtn)
  firstSelectableDayButton = getAllByRole(/presentation/i)[getDay]
  user.click(firstSelectableDayButton)

  expect(logItBtn).not.toBeDisabled()

  await waitFor(()=>user.click(logItBtn))

  expect(getByTitle(/error/i)).toBeInTheDocument()

}, 20000);

test('View Entries Page', async () => {
  mockGetProjectList.mockResolvedValueOnce({result:{data:[
    {
      id: 123,
      name: 'proj1',
    },
    {
      id: 234,
      name: 'proj2',
    },
    {
      id: 345,
      name: 'proj3',
    },
  ]}})
  const fakeTimeEntry = {
    date: dateFns.format(new Date(), "yyyy-MM-dd"),
    id: 1234,
    minutes: 480,
    projectColor: "#13a480",
    projectId: 4567,
    projectName: "Test Name",
    tags: ["#One", "#Two"],
  }
  mockGetLoggedTime.mockResolvedValueOnce({
    success:true,
    result:[
      fakeTimeEntry
  ]}) 
  // test error response
  mockGetLoggedTime.mockResolvedValueOnce({
    error: 'COULD NOT GET ENTRIES',
  })

  const {getByText} = renderAppAfterListFetch()

  // since we're updating state inside the form, we wait for the below change to appear
  await waitFor(() => getByText(/view entries/i))
  user.click(getByText(/view entries/i))
  // wait for the first fake time entry to appear
  await waitFor(() => getByText(/Test Name/i))

  expect(mockGetLoggedTime).toHaveBeenCalledTimes(1)
  const payloadObj = 
  JSON.stringify({
    "from":fakeTimeEntry.date,
    "to":fakeTimeEntry.date,
  })
  expect(mockGetLoggedTime).toHaveBeenCalledWith({
    payload:payloadObj,
    "token": fakeToken
  })

  
  user.click(getByText(/last week/i))
  await waitFor(() => getByText(/Monday/i))
  expect(getByText(/tuesday/i)).toBeInTheDocument()
  expect(getByText(/wednesday/i)).toBeInTheDocument()
  expect(getByText(/thursday/i)).toBeInTheDocument()
  expect(getByText(/friday/i)).toBeInTheDocument()
  expect(getByText(/saturday/i)).toBeInTheDocument()
  expect(getByText(/sunday/i)).toBeInTheDocument()

  expect(mockGetLoggedTime).toHaveBeenCalledTimes(2)
  expect(getByText(/ERROR: COULD NOT GET ENTRIES/i)).toBeInTheDocument()

}, 20000);