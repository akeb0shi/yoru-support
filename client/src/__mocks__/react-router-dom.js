// mocks for react-router-dom, needed in order for tests to run
export const useNavigate = () => jest.fn();
export const Link = ({ children }) => <div>{children}</div>;
export const BrowserRouter = ({ children }) => <div>{children}</div>;