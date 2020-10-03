<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 25.09.15
 * Time: 15:58
 */

namespace SVB\CBS\ShippingWorldBundle\Model;

use HireVoice\Neo4j\Annotation as OGM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Class Librarian
 * @package SVB\CBS\ShippingWorldBundle\Model
 *
 * @OGM\Entity(labels="Librarian,Actor")
 */
class Librarian implements  LibrarianInterface
{

    /**
     * @var int
     *
     * @OGM\Auto
     */
    private $id;

    /**
     * @var string
     *
     * @OGM\Property
     */
    private $name;

    /**
     * @var VillageInterface
     *
     * @OGM\ManyToOne(relation="librarian_of")
     */
    private $village;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return VillageInterface
     */
    public function getVillage()
    {
        return $this->village;
    }

    /**
     * @param int $id
     * @return Librarian
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @param string $name
     * @return Librarian
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @param VillageInterface $village
     * @return Librarian
     */
    public function setVillage($village)
    {
        $this->village = $village;
        return $this;
    }

    /**
     * @return Librarian
     */
    public static function create(){
        return new Librarian();
    }
}