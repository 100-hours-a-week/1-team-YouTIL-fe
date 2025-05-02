import LinkGithubButton from "@/components/commit/linkGithubButton/LinkGithubButton";
import SelectBranchModal from "@/components/commit/selectBranchModal/SelectBranchModal";
import SelectDateCalender from "@/components/commit/selectDateCalender/SelectDateCalender";
import SelectOrganizationModal from "@/components/commit/selectOrganizationModal/SelectOrganizationModal";
import SelectRepositoryModal from "@/components/commit/selectRepositoryModal/SelectRepositoryModal";
import NoCommitDescription from "@/components/description/noCommitDescription/NoCommitDescription";

import './page.scss';

const commit =() =>{
    return(
        <div className="commit-page">
            <SelectDateCalender/>
            <LinkGithubButton/>
            <NoCommitDescription/>
        </div>
    )
}

export default commit;