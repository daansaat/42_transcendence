import { User } from "../../../contexts";
import { useChat } from "../../../contexts/ChatContext";
import { MdBlock, MdBlockFlipped } from "react-icons/md"


export const BlockButton: React.FC<{ member: User }> = ({ member }) => {
	const { blocked, handleBlock } = useChat();

	const handleClick = async(e: React.MouseEvent, member: User, blockAction: string) => {
		e.stopPropagation();
		await handleBlock(member, blockAction);
	};
	
	const isBlocked: boolean = blocked.some(
		blocked => blocked.userName === member.userName);
	
	return (
		isBlocked 
		? <button className="iconBtn unblockBtn" color="red" onClick={(e) => handleClick(e, member, "unblock")}>
				<MdBlock size="1.5em" />
			</button> 
		: <button className="iconBtn blockBtn" onClick={(e) => handleClick(e, member, "block")}>
				<MdBlockFlipped size="1.5em" color="black"/> 
			</button>
	)
}
