import Loading from "../../components/UI/Loading/Loading"

const LoadingPage = () => {
    const onClickRefund = () => {

    }
    return <Loading title={'Loading'} onClickRefund={onClickRefund} roomName={`this.props.roomName`} />
    
}

export default LoadingPage;
