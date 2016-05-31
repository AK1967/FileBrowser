using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Http;
using System.Web.Hosting;
using FileBrowser.Models;
using System.Web.Script.Serialization;

namespace FileBrowser.Controllers
{
    public class FileBrowserController : ApiController
    {
        // GET: api/filebrowser
        /// <summary>
        /// Get Directories Path
        /// </summary>
        /// <returns>Get string that represent Directories Path</returns>
        [HttpGet]
        public object Get()
        {
            var dir = System.Web.Configuration.WebConfigurationManager.AppSettings["FileBrowserDirectory"] == "" ? HostingEnvironment.MapPath("~/") : System.Web.Configuration.WebConfigurationManager.AppSettings["FileBrowserDirectory"];

            var fileBrowser = GetFiles(dir);

            var strFileBrowser = "[" + new JavaScriptSerializer().Serialize(fileBrowser) + "]";

            return strFileBrowser;
        }

        // POST: api/filebrowser
        [HttpPost]
        public string Post(string name)
        {
            using (var readFile = new StreamReader(name))
            {
                var textFromFile = readFile.ReadToEnd();
                var bytes = Encoding.Default.GetBytes(textFromFile);
                textFromFile = Encoding.UTF8.GetString(bytes);

                return textFromFile;
            }
        }

        #region Робота з деревом файлів

        #region Побудова дерева файлів
        TreeNode GetFiles(string path)
        {
            var treeNode = new TreeNode { Node = path, ChildrenNode = new List<TreeNode>() };

            Queue<string> queue = new Queue<string>();
            queue.Enqueue(path);

            while (queue.Count > 0)
            {
                path = queue.Dequeue();

                var selectedTreeNode = SearchNode(treeNode, path) ?? treeNode;

                try
                {
                    var subDirs = Directory.GetDirectories(path);

                    foreach (var subDir in subDirs)
                    {
                        queue.Enqueue(subDir);

                        selectedTreeNode.ChildrenNode.Add(new TreeNode
                        {
                            Node = subDir + "\\",
                            ChildrenNode = new List<TreeNode>()
                        });
                    }

                    var files = Directory.GetFiles(path);

                    foreach (var file in files)
                    {
                        var fileInfo = new FileInfo(file);
                        selectedTreeNode.ChildrenNode.Add(new TreeNode
                        {
                            Node = file,
                            Size = fileInfo.Length,
                            ChildrenNode = null
                        });
                    }

                    selectedTreeNode.Size = DirSize(new DirectoryInfo(path));
                }
                catch (Exception)
                {
                    treeNode.Node = $"ERROR: Access denied to directory {path}";
                    treeNode.ChildrenNode = null;
                    treeNode.Size = 0;

                    return treeNode;
                }
            }

            return treeNode;
        }
        #endregion
        #region Пошук гілки дерева
        static TreeNode SearchNode(TreeNode node, string searchstring)
        {
            if (node.Node.StartsWith(searchstring)) return node;
            return node.ChildrenNode?.Select(n => SearchNode(n, searchstring)).FirstOrDefault(result => result != null);
        }
        #endregion
        #region Отримуємо розмір каталогу
        private static long DirSize(DirectoryInfo dir)
        {
            return dir.GetFiles().Sum(fi => fi.Length) +
                   dir.GetDirectories().Sum(di => DirSize(di));
        }
        #endregion
        #endregion
    }
}
