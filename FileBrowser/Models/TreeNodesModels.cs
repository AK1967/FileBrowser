using System.Collections.Generic;

namespace FileBrowser.Models
{
    public class TreeNode
    {
        public string NodeId { get; set; }
        public string Node { get; set; }
        public long? Size { get; set; }
        public List<TreeNode> ChildrenNode { get; set; }
    }
}