import { useEffect, useState } from "react";
import Folder from "../components/ui/Folder/Folder";
import "../styles/ResourcePage.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DEFAULT_FOLDERS = [
  "DSA",
  "React",
  "Java",
  "Web Development",
  "AWS",
  "College",
  "Other",
];

function ResourcePage() {
  const [folders, setFolders] = useState([]);
  const [resources, setResources] = useState([]);

  const [selectedFolder, setSelectedFolder] = useState(null);

  const [newFolder, setNewFolder] = useState("");

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [resourceFolder, setResourceFolder] = useState("");

  // =====================================================
  // LOAD DATA FROM POSTGRESQL
  // =====================================================

  useEffect(() => {
    loadFolders();
    loadResources();
  }, []);

  const loadFolders = async () => {
    try {
      const response = await fetch(`${API_URL}/folders`);

      if (!response.ok) {
        throw new Error("Failed to load folders");
      }

      const data = await response.json();

      if (data.length === 0) {
        await createDefaultFolders();
      } else {
        setFolders(data);

        if (data.length > 0) {
          setResourceFolder(data[0].name);
        }
      }
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const createDefaultFolders = async () => {
    try {
      const createdFolders = [];

      for (const folderName of DEFAULT_FOLDERS) {
        const response = await fetch(`${API_URL}/folders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: folderName,
            color: "#7c3aed",
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to create folder: ${folderName}`
          );
        }

        const folder = await response.json();

        createdFolders.push(folder);
      }

      setFolders(createdFolders);

      if (createdFolders.length > 0) {
        setResourceFolder(createdFolders[0].name);
      }
    } catch (error) {
      console.error(
        "Error creating default folders:",
        error
      );
    }
  };

  const loadResources = async () => {
    try {
      const response = await fetch(`${API_URL}/resources`);

      if (!response.ok) {
        throw new Error("Failed to load resources");
      }

      const data = await response.json();

      // Backend stores folder name in "category".
      // Frontend uses "folder".
      const formattedResources = data.map(
        (resource) => ({
          ...resource,
          folder: resource.category,
        })
      );

      setResources(formattedResources);
    } catch (error) {
      console.error(
        "Error loading resources:",
        error
      );
    }
  };

  // =====================================================
  // CREATE FOLDER
  // =====================================================

  const handleCreateFolder = async (e) => {
    e.preventDefault();

    const folderName = newFolder.trim();

    if (!folderName) {
      return;
    }

    const alreadyExists = folders.some(
      (folder) =>
        folder.name.toLowerCase() ===
        folderName.toLowerCase()
    );

    if (alreadyExists) {
      alert(
        "A folder with this name already exists."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/folders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: folderName,
            color: "#7c3aed",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to create folder"
        );
      }

      const createdFolder =
        await response.json();

      setFolders((prev) => [
        ...prev,
        createdFolder,
      ]);

      setNewFolder("");

      setResourceFolder(
        createdFolder.name
      );
    } catch (error) {
      console.error(
        "Error creating folder:",
        error
      );

      alert("Failed to create folder.");
    }
  };

  // =====================================================
  // DELETE FOLDER
  // =====================================================

  const handleDeleteFolder = async (
    folder
  ) => {
    const folderName = folder.name;

    const confirmed = window.confirm(
      `Delete "${folderName}" folder?\n\nAll resources inside this folder will also be deleted.`
    );

    if (!confirmed) {
      return;
    }

    try {
      // Delete resources inside folder
      const folderResources =
        resources.filter(
          (resource) =>
            resource.folder === folderName
        );

      for (const resource of folderResources) {
        const response = await fetch(
          `${API_URL}/resources/${resource.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to delete resource"
          );
        }
      }

      // Delete folder
      const response = await fetch(
        `${API_URL}/folders/${folder.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete folder"
        );
      }

      // Update frontend state
      setFolders((prev) =>
        prev.filter(
          (item) => item.id !== folder.id
        )
      );

      setResources((prev) =>
        prev.filter(
          (resource) =>
            resource.folder !== folderName
        )
      );

      if (
        selectedFolder === folderName
      ) {
        setSelectedFolder(null);
      }

      setResourceFolder((current) => {
        if (current !== folderName) {
          return current;
        }

        const remainingFolder =
          folders.find(
            (item) =>
              item.id !== folder.id
          );

        return remainingFolder
          ? remainingFolder.name
          : "";
      });
    } catch (error) {
      console.error(
        "Error deleting folder:",
        error
      );

      alert("Failed to delete folder.");
    }
  };

  // =====================================================
  // ADD RESOURCE
  // =====================================================

  const handleAddResource = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert(
        "Please enter a resource title."
      );
      return;
    }

    if (!url.trim()) {
      alert(
        "Please enter a resource URL."
      );
      return;
    }

    if (!resourceFolder) {
      alert(
        "Please select a folder."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/resources`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            url: url.trim(),
            category: resourceFolder,
            description:
              description.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to create resource"
        );
      }

      const createdResource =
        await response.json();

      const formattedResource = {
        ...createdResource,
        folder:
          createdResource.category,
      };

      setResources((prev) => [
        formattedResource,
        ...prev,
      ]);

      setTitle("");
      setUrl("");
      setDescription("");
    } catch (error) {
      console.error(
        "Error adding resource:",
        error
      );

      alert("Failed to add resource.");
    }
  };

  // =====================================================
  // DELETE RESOURCE
  // =====================================================

  const handleDeleteResource = async (
    id
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/resources/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete resource"
        );
      }

      setResources((prev) =>
        prev.filter(
          (resource) =>
            resource.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Error deleting resource:",
        error
      );

      alert("Failed to delete resource.");
    }
  };

  // =====================================================
  // GET FOLDER RESOURCES
  // =====================================================

  const getFolderResources = (
    folderName
  ) => {
    return resources.filter(
      (resource) =>
        resource.folder === folderName
    );
  };

  const selectedResources =
    selectedFolder
      ? getFolderResources(
          selectedFolder
        )
      : [];

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="resource-page">

      {/* HEADER */}

      <div className="resource-header">

        <div>
          <h1>
            Resource Vault
          </h1>
        </div>

        <div className="resource-total">
          {resources.length} Resources
        </div>

      </div>


      {/* CREATE FOLDER */}

      <div className="folder-create-section">

        <div className="folder-create-heading">

          <h2>
            Create Folder
          </h2>

          <br />

        </div>

        <form
          className="folder-create-form"
          onSubmit={
            handleCreateFolder
          }
        >

          <input
            type="text"
            placeholder="Enter folder name..."
            value={newFolder}
            onChange={(e) =>
              setNewFolder(
                e.target.value
              )
            }
          />

          <button type="submit">
            + Create Folder
          </button>

        </form>

      </div>


      {/* ADD RESOURCE */}

      <div className="resource-add-section">

        <div className="resource-add-heading">

          <h2>
            Add Resource
          </h2>

          <br />

        </div>

        <form
          className="resource-form"
          onSubmit={
            handleAddResource
          }
        >

          <input
            type="text"
            placeholder="Resource title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />

          <input
            type="url"
            placeholder="Resource URL"
            value={url}
            onChange={(e) =>
              setUrl(
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

          <select
            value={resourceFolder}
            onChange={(e) =>
              setResourceFolder(
                e.target.value
              )
            }
          >

            <option value="">
              Select Folder
            </option>

            {folders.map(
              (folder) => (
                <option
                  key={folder.id}
                  value={folder.name}
                >
                  {folder.name}
                </option>
              )
            )}

          </select>

          <button type="submit">
            Add Resource
          </button>

        </form>

      </div>


      {/* FOLDERS */}

      {!selectedFolder && (

        <section className="resource-folders-section">

          <div className="resource-section-heading">

            <div>

              <h2>
                Your Folders
              </h2>

              <p>
                Click a folder to view
                its resources.
              </p>

            </div>

            <span>
              {folders.length} folders
            </span>

          </div>


          <div className="resource-folders">

            {folders.map(
              (folder) => {

                const count =
                  getFolderResources(
                    folder.name
                  ).length;

                return (

                  <div
                    className="resource-folder-wrapper"
                    key={folder.id}
                  >

                    {/* DELETE */}

                    <button
                      className="folder-delete-button"
                      title={`Delete ${folder.name}`}
                      onClick={() =>
                        handleDeleteFolder(
                          folder
                        )
                      }
                    >
                      🗑
                    </button>


                    {/* FOLDER */}

                    <Folder
                      color="#7c3aed"
                      size={1}
                      onClick={() =>
                        setSelectedFolder(
                          folder.name
                        )
                      }
                    />


                    {/* NAME */}

                    <div className="folder-info">

                      <h3>
                        {folder.name}
                      </h3>

                      <span>
                        {count}{" "}
                        {count === 1
                          ? "resource"
                          : "resources"}
                      </span>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        </section>

      )}


      {/* RESOURCE VIEW */}

      {selectedFolder && (

        <section className="selected-resource-section">

          {/* HEADER */}

          <div className="selected-category-header">

            <button
              className="back-folder-button"
              onClick={() =>
                setSelectedFolder(
                  null
                )
              }
            >
              ← Back to Folders
            </button>


            <div className="selected-folder-title">

              <h2>
                {selectedFolder}
              </h2>

              <p>
                {selectedResources.length}{" "}
                {selectedResources.length ===
                1
                  ? "resource"
                  : "resources"}
              </p>

            </div>


            <button
              className="selected-folder-delete"
              onClick={() => {

                const folder =
                  folders.find(
                    (item) =>
                      item.name ===
                      selectedFolder
                  );

                if (folder) {
                  handleDeleteFolder(
                    folder
                  );
                }

              }}
            >
              🗑 Delete Folder
            </button>

          </div>


          {/* EMPTY */}

          {selectedResources.length ===
          0 ? (

            <div className="empty-resource">

              <div className="empty-resource-icon">
                📂
              </div>

              <h3>
                No resources yet
              </h3>

              <p>
                Add a resource to the{" "}
                <strong>
                  {selectedFolder}
                </strong>{" "}
                folder.
              </p>

            </div>

          ) : (

            <div className="resource-list">

              {selectedResources.map(
                (resource) => (

                  <div
                    className="resource-card"
                    key={resource.id}
                  >

                    {/* PARTICLES */}

                    <div className="resource-particles">

                      <span className="resource-particle rp-1">
                        ✦
                      </span>

                      <span className="resource-particle rp-2">
                        ·
                      </span>

                      <span className="resource-particle rp-3">
                        ✧
                      </span>

                      <span className="resource-particle rp-4">
                        ·
                      </span>

                      <span className="resource-particle rp-5">
                        ✦
                      </span>

                      <span className="resource-particle rp-6">
                        ·
                      </span>

                      <span className="resource-particle rp-7">
                        ✧
                      </span>

                      <span className="resource-particle rp-8">
                        ·
                      </span>

                    </div>


                    {/* CONTENT */}

                    <div className="resource-card-info">

                      <h3>
                        {resource.title}
                      </h3>

                      {resource.description && (
                        <p>
                          {
                            resource.description
                          }
                        </p>
                      )}

                      <span className="resource-category">
                        {resource.folder}
                      </span>

                    </div>


                    {/* ACTIONS */}

                    <div className="resource-actions">

                      <a
                        href={
                          resource.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-open"
                      >
                        Open
                      </a>

                      <button
                        className="resource-delete"
                        onClick={() =>
                          handleDeleteResource(
                            resource.id
                          )
                        }
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      )}

    </div>
  );
}

export default ResourcePage;