import HomePage from "../pages/home";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HomeLayout(params: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (<HomePage {...params as any} />)
}

export default {
  Layout: HomeLayout,
  Evaluator: async () => {
    return Promise.resolve(true);
  }
}